from flask import Flask, request, render_template
import pandas as pd

app = Flask(__name__)
df = pd.read_csv('final_merged.csv', on_bad_lines='skip')
for col in df.columns[1:]:
    df[col] = pd.to_numeric(df[col], errors='coerce')

@app.route('/', methods=['GET', 'POST'])
def filter_gdp():
    years = [col for col in df.columns if col.isdigit()]
    result = []
    if request.method == 'POST':
        year = request.form['year']
        pop_min = request.form.get('pop_min', type=int)
        pop_max = request.form.get('pop_max', type=int)
        if year not in years:
            return render_template('gdp.html', years=years, result=result, error="Selected year is not available in the data.")
        if not pop_min or not pop_max or pop_min < 0 or pop_max < 0:
            return render_template('gdp.html', years=years, result=result, error="Please provide valid population range.")
        filtered = df[
            (df['Population'].astype(float) >= pop_min) & 
            (df['Population'].astype(float) <= pop_max)
        ].copy()

        if year in filtered.columns:
            filtered['gdp'] = pd.to_numeric(filtered[year], errors='coerce')
            top10 = filtered.sort_values(by='gdp', ascending=False).head(10)
            result = [
                {'Country': row['Country Name'], 'gdp': row['gdp'], 'pop': row['Population']}
                for _, row in top10.iterrows()
            ]
        else:
            return render_template('gdp.html', years=years, result=result, error="No data available for the selected year.")

    return render_template('gdp.html', years=years, result=result)

if __name__ == '__main__':
    app.run(debug=True)
