import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import math

# Initialize Flask with a reference to the React build folder
app = Flask(__name__, static_folder='../frontend/dist', static_url_path='/')
CORS(app)

# Material Library Presets (Name: Yield Strength in MPa)
MATERIALS = {
    "A36 Steel": 250,
    "High-Strength Steel (Grade 50)": 345,
    "Concrete (C30)": 30,
    "Concrete (C60)": 60,
    "Aluminum (6061)": 240,
    "Timber (Softwood)": 15,
    "Titanium (Grade 5)": 880,
    "Custom": 0
}

# Serve React App
@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/materials', methods=['GET'])
def get_materials():
    return jsonify(MATERIALS)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    
    try:
        load = float(data.get('load', 0))
        length = float(data.get('length', 0))
        area = float(data.get('area', 1))
        strength = float(data.get('strength', 1))
        struct_type = data.get('type', 'Beam')
        
        # Core Computations (kN / cm2 * 10 = MPa)
        stress = (load / area) * 10
        safety_factor = strength / stress if stress > 0 else float('inf')
        utilization = stress / strength
        
        slenderness = None
        if struct_type == "Column":
            # Simplified slenderness: L(cm) / sqrt(A(cm2))
            slenderness = (length * 100) / math.sqrt(area)
            
        # Decision Engine
        result = "SAFE"
        reason = "Structure is within safe operating limits."
        suggestions = []
        
        if safety_factor < 1:
            result = "FAILURE"
            reason = "Structural failure likely: Stress exceeds material strength."
            suggestions.append("Increase cross-sectional area")
            suggestions.append("Use stronger material")
        elif utilization > 0.8:
            result = "HIGH RISK"
            reason = "High utilization of material strength. Near failure limit."
            suggestions.append("Increase area")
            suggestions.append("Reduce applied load")
        elif struct_type == "Column" and slenderness and slenderness > 50:
            result = "MEDIUM RISK"
            reason = "High slenderness ratio: Risk of buckling even under nominal load."
            suggestions.append("Reduce column height")
            suggestions.append("Increase cross-sectional dimensions")
        elif utilization > 0.5:
            result = "SAFE"
            reason = "Moderate loading. Structural integrity is sound."
        else:
            result = "SAFE"
            reason = "Optimally designed for current load."

        # Generate Graph Data (Stress Curve)
        graph_data = []
        for factor in [0.5, 0.75, 1.0, 1.25, 1.5]:
            sim_load = load * factor
            sim_stress = (sim_load / area) * 10
            graph_data.append({
                "load": round(sim_load, 1),
                "stress": round(sim_stress, 2),
                "utilization": round(sim_stress / strength, 2)
            })

        # Final Response
        response = {
            "result": result,
            "stress": round(stress, 2),
            "safety_factor": round(safety_factor, 2) if safety_factor != float('inf') else "N/A",
            "utilization": round(utilization, 2),
            "slenderness": round(slenderness, 2) if slenderness is not None else None,
            "reason": reason,
            "suggestions": suggestions,
            "graph_data": graph_data,
            "material_strength": strength
        }
        
        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Catch-all route to handle React Router (Single Page Application)
@app.errorhandler(404)
def not_found(e):
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    # Use environment variable for port (for cloud deployment)
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port)
