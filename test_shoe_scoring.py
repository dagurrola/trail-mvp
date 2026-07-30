"""
Regresion de paridad shoe_scoring.py vs index.html (recomendar()).

Estos 12 casos son una muestra fija de una corrida de paridad completa:
25,920 combinaciones (terreno x nivel x presupuesto x objetivo x humedad x
pisada x prioridad) comparadas contra la salida real de index.html en Node,
con 0 mismatches. Si este test falla, el puerto Python se desincronizo del
JS — revisar shoe_scoring.py contra la funcion recomendar() en index.html.

Correr: python3 -m pytest test_shoe_scoring.py -q  (o: python3 test_shoe_scoring.py)
"""
from shoe_scoring import cargar_catalogo, recomendar

CASOS = [
    (dict(terreno="mixto", nivel="principiante", presupuesto="mas4000", objetivo="entrenamiento",
          humedad="ambos", pisada="pronador", prioridad="agarre"),
     ("Salomon XA Pro 3D v9", "Hoka Challenger 8", "Saucony Peregrine 16")),
    (dict(terreno="montaña", nivel="intermedio", presupuesto="mas4000", objetivo="entrenamiento",
          humedad="humedo", pisada="neutral", prioridad="amortiguacion"),
     ("Asics Trabuco Max 5", "La Sportiva Prodigio Max", "La Sportiva Jackal II")),
    (dict(terreno="montaña", nivel="principiante", presupuesto="2000-4000", objetivo="tecnica",
          humedad="", pisada="supinador", prioridad="estabilidad"),
     ("The North Face Vectiv Infinite 3", "Asics Trabuco Max 5", "La Sportiva Mutant")),
    (dict(terreno="mixto", nivel="avanzado", presupuesto="menos2000", objetivo="10K",
          humedad="humedo", pisada="supinador", prioridad="estabilidad"),
     ("Adidas Terrex Agravic Flow 2", "Salomon Sense Ride 5", "Merrell Moab 3 Vent")),
    (dict(terreno="roca", nivel="intermedio", presupuesto="menos2000", objetivo="distancia",
          humedad="humedo", pisada="pronador", prioridad="agarre"),
     ("Merrell Moab 3 Vent", "Adidas Terrex Agravic Flow 2", "Salomon Sense Ride 5")),
    (dict(terreno="roca", nivel="principiante", presupuesto="mas4000", objetivo="tecnica",
          humedad="seco", pisada="", prioridad="estabilidad"),
     ("La Sportiva Bushido III", "Hoka Mafate 5", "La Sportiva Mutant")),
    (dict(terreno="roca", nivel="principiante", presupuesto="2000-4000", objetivo="tecnica",
          humedad="seco", pisada="pronador", prioridad="estabilidad"),
     ("La Sportiva Bushido III", "Asics Trabuco Max 5", "La Sportiva Mutant")),
    (dict(terreno="montaña", nivel="avanzado", presupuesto="menos2000", objetivo="velocidad",
          humedad="", pisada="pronador", prioridad="agarre"),
     ("Merrell Moab 3 Vent", "Adidas Terrex Agravic Flow 2", "Salomon Sense Ride 5")),
    (dict(terreno="mixto", nivel="avanzado", presupuesto="menos2000", objetivo="distancia",
          humedad="humedo", pisada="pronador", prioridad="agarre"),
     ("Merrell Moab 3 Vent", "Adidas Terrex Agravic Flow 2", "Salomon Sense Ride 5")),
    (dict(terreno="montaña", nivel="intermedio", presupuesto="2000-4000", objetivo="5K",
          humedad="ambos", pisada="supinador", prioridad="amortiguacion"),
     ("Asics Trabuco Max 5", "La Sportiva Prodigio Max", "La Sportiva Jackal II")),
    (dict(terreno="mixto", nivel="intermedio", presupuesto="menos2000", objetivo="21K",
          humedad="", pisada="pronador", prioridad="estabilidad"),
     ("Merrell Moab 3 Vent", "Adidas Terrex Agravic Flow 2", "Salomon Sense Ride 5")),
    (dict(terreno="mixto", nivel="avanzado", presupuesto="menos2000", objetivo="10K",
          humedad="seco", pisada="pronador", prioridad=""),
     ("Merrell Moab 3 Vent", "Adidas Terrex Agravic Flow 2", "Salomon Sense Ride 5")),
]


def test_paridad_js():
    catalogo = cargar_catalogo()
    for inputs, esperado in CASOS:
        r = recomendar(catalogo, **inputs)
        obtenido = (
            r["recomendado"]["nombre"] if r["recomendado"] else None,
            r["alternativa_comoda"]["nombre"] if r["alternativa_comoda"] else None,
            r["alternativa_traccion"]["nombre"] if r["alternativa_traccion"] else None,
        )
        assert obtenido == esperado, f"{inputs} -> {obtenido}, esperado {esperado}"


if __name__ == "__main__":
    test_paridad_js()
    print(f"OK — {len(CASOS)} casos de paridad pasaron.")
