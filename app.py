from flask import Flask, request, render_template, jsonify
import pandas as pd
import json

app = Flask(__name__)
df = pd.read_csv('final_merged.csv', on_bad_lines='skip')
df['Population'] = pd.to_numeric(df['Population'], errors='coerce')
year_columns = [col for col in df.columns if col.isdigit()]
for col in year_columns: df[col] = pd.to_numeric(df[col], errors='coerce')

@app.route('/', methods=['GET', 'POST'])
def home():
    selected_year = 2023
    selected_pop = 0
    if request.method == 'POST':
        selected_year = int(request.form.get('year', 2023))
        selected_pop = int(request.form.get('population', 0))
    filtered = df[df['Population'] >= selected_pop].copy()
    if str(selected_year) in df.columns:
        filtered['gdp_per_capita'] = filtered[str(selected_year)]
        top10 = filtered.sort_values(by='gdp_per_capita', ascending=False).head(10)
        chart_labels = list(top10['Country Name'])
        chart_data = list(round(top10['gdp_per_capita'], 2))
    else:
        chart_labels = []
        chart_data = []
    return render_template('gdp.html', years=year_columns, selected_year=selected_year, selected_pop=selected_pop, chart_labels=json.dumps(chart_labels), chart_data=json.dumps(chart_data))

@app.route('/api/gdp')
def api_gdp():
    year = request.args.get('year')
    min_population = int(request.args.get('min_population', 0))
    if year not in df.columns: return jsonify([])
    filtered = df[df['Population'] >= min_population].copy()
    filtered['gdp_per_capita'] = filtered[year]
    top10 = filtered.sort_values(by='gdp_per_capita', ascending=False).head(10)
    result = [{"country": row['Country Name'], "gdp_per_capita": round(row['gdp_per_capita'], 2)} for _, row in top10.iterrows()]
    return jsonify(result)




if __name__ == '__main__': app.run(debug=True)
