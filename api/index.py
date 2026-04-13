from flask import Flask, request, jsonify
from flask_cors import CORS
import math
import os

app = Flask(__name__)
CORS(app)

# Material Library Presets
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

@app.route('/api/materials', methods=['GET'])
def get_materials():
    return jsonify(MATERIALS)

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.get_json()
    try:
        load = float(data.get('load', 0))
        length = float(data.get('length', 0))
        area = float(data.get('area', 1))
        strength = float(data.get('strength', 1))
        struct_type = data.get('type', 'Beam')
        
        stress = (load / area) * 10
        safety_factor = strength / stress if stress > 0 else float('inf')
        utilization = stress / strength
        
        slenderness = None
        if struct_type == "Column":
            slenderness = (length * 100) / math.sqrt(area)
            
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
            reason = "High utilization of material strength."
            suggestions.append("Increase area")
            suggestions.append("Reduce load")
        elif struct_type == "Column" and slenderness and slenderness > 50:
            result = "MEDIUM RISK"
            reason = "High slenderness ratio: Risk of buckling."
            suggestions.append("Reduce column height")
            suggestions.append("Increase dimensions")
        
        graph_data = []
        for factor in [0.5, 0.75, 1.0, 1.25, 1.5]:
            sim_load = load * factor
            sim_stress = (sim_load / area) * 10
            graph_data.append({
                "load": round(sim_load, 1), "stress": round(sim_stress, 2), "utilization": round(sim_stress / strength, 2)
            })

        return jsonify({
            "result": result, "stress": round(stress, 2), "safety_factor": round(safety_factor, 2) if safety_factor != float('inf') else "N/A",
            "utilization": round(utilization, 2), "slenderness": round(slenderness, 2) if slenderness is not None else None,
            "reason": reason, "suggestions": suggestions, "graph_data": graph_data, "material_strength": strength
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Vercel requires the app instance
app_instance = app
