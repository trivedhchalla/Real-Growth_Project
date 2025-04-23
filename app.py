from flask import Flask , request , render_template_string
from flask import Flask, request, render_template_string
import pandas as pd

app = Flask(__name__)

# Load and prepare your dataset once
df = pd.read_csv('dummy.csv', on_bad_lines='skip')
for col in df.columns[1:]:
    df[col] = pd.to_numeric(df[col], errors='coerce')

@app.route('/', methods=['GET', 'POST'])
def filter_gdp():
    years = [col for col in df.columns if col.isdigit()]
    result = []
    if request.method == 'POST':
        year = request.form['year']
        pop_min = int(request.form['pop_min'])
        pop_max = int(request.form['pop_max'])
        filtered = df[(df['population'].astype(float) >= pop_min) &(df['population'].astype(float) <= pop_max)].copy()
        if year in filtered.columns:
            filtered['gdp'] = pd.to_numeric(filtered[year], errors='coerce')
            top10 = filtered.sort_values(by='gdp', ascending=False).head(10)
            result = [
                {'country': row['country'], 'gdp': row['gdp'], 'pop': row['population']}
                for _, row in top10.iterrows()
            ]

    return render_template_string(TEMPLATE, years=years, result=result)

if __name__ == '__main__':
    app.run(debug=True)
