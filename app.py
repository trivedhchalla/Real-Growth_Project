from flask import Flask, request, jsonify, render_template
import pandas as pd
app = Flask(__name__)
df = pd.read_csv('final_merged.csv', on_bad_lines='skip')
df['Population'] = pd.to_numeric(df['Population'], errors='coerce')
year_columns = [col for col in df.columns if col.isdigit()]
for col in year_columns:
    df[col] = pd.to_numeric(df[col], errors='coerce')
@app.route('/')
def index():
    return render_template('gdp.html') 
@app.route('/api/gdp')
def api_gdp():
    year = request.args.get('year')
    min_population = int(request.args.get('min_population', 0))
    if year not in df.columns:
        return jsonify([])
    filtered = df[df['Population'] >= min_population].copy()
    filtered['gdp_per_capita'] = filtered[year]
    top10 = filtered.sort_values(by='gdp_per_capita', ascending=False).head(10)
    result = [{"country": row['Country Name'],"gdp_per_capita": round(row['gdp_per_capita'], 2)
        }for _, row in top10.iterrows()]
    return jsonify(result)
if __name__ == '__main__':
    app.run(debug=True)
