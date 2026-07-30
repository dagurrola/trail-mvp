#!/usr/bin/env python3
"""
shoe_scoring.py — Port a Python de la logica de recomendacion de Shoe Coach
(index.html, funcion recomendar()). Fuente de verdad sigue siendo el JS del
prototipo trail-mvp; este modulo es una traduccion FIEL para que Runcierge
pueda consumir el mismo catalogo/scoring sin reimplementar nada desde cero.

Uso previsto: cuando dacoach_poller.py detecte que un par de zapatos cruzo
el umbral de km (R-33, ya desplegado), puede llamar a recomendar() aqui con
el terreno/nivel/objetivo/presupuesto del perfil del atleta para sugerir un
reemplazo especifico, en vez de solo avisar "se acabo el par".

Este archivo vive en trail-mvp (no en el repo de Runcierge/VPS) — cuando se
conecte de verdad, hay que copiarlo/importarlo al lado de dacoach_poller.py
y mantenerlo en paridad si el JS cambia. No se toca dacoach_poller.py aqui.

IMPORTANTE — paridad, no reinvencion: cada funcion espeja su equivalente en
index.html linea por linea. Si el JS cambia, este archivo debe actualizarse
a mano (no hay build step automatico entre ambos).
"""
import json
import os

CATALOGO_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "catalogo.json")

TERRAIN_BUCKET = {
    "montaña": "technical_trail",
    "roca": "technical_trail",
    "bosque": "mixed_trail",
    "mixto": "mixed_trail",
}

BUDGET_MAX = {"menos2000": 1999, "2000-4000": 4000, "mas4000": 99999}
BUDGET_TOLERANCE = {"menos2000": 0.12, "2000-4000": 0.15, "mas4000": 0.20}


def cargar_catalogo(path=CATALOGO_PATH):
    """Carga el catalogo.json exportado desde index.html."""
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def budget_badge(zapato, max_mxn, max_soft):
    """REGLA de presupuesto — identico a budgetBadge() en index.html."""
    if zapato["precioNum"] <= max_mxn:
        return "dentro"
    if zapato["precioNum"] <= max_soft:
        return "subir"
    return "fuera"


def preferencia_score(zapato, pisada, prioridad, terreno):
    """
    REGLA 1d/1e — boost aditivo por preferencias opcionales (pisada, prioridad)
    y por terreno especifico (roca vs montaña, bosque vs mixto). Identico a
    preferenciaScore() en index.html. Si no hay preferencias, devuelve 0 y
    el comportamiento es identico al ranking base (agarre+estabilidad).
    """
    score = 0
    metricas = zapato.get("metricas", {})
    if pisada == "pronador":
        score += (metricas.get("estabilidad") or 0) * 2
    if pisada == "supinador":
        score += (metricas.get("amortiguacion") or 0) * 2
    if prioridad == "ligereza" and zapato.get("peso_g"):
        score += max(0, (350 - zapato["peso_g"])) / 20
    if prioridad == "agarre":
        score += (metricas.get("agarre") or 0) * 2
    if prioridad == "amortiguacion":
        score += (metricas.get("amortiguacion") or 0) * 2
    if prioridad == "estabilidad":
        score += (metricas.get("estabilidad") or 0) * 2
    if terreno and terreno in (zapato.get("terrenoKeys") or []):
        score += 3
    return score


def pick_recommended(pool, max_mxn, pisada="", prioridad="", terreno=""):
    """REGLA 6 — identico a pickRecommended() en index.html."""
    in_budget = [z for z in pool if z["precioNum"] <= max_mxn]
    if len(in_budget) >= 1:
        return sorted(
            in_budget,
            key=lambda z: (
                -(
                    (z["metricas"]["agarre"] + z["metricas"]["estabilidad"])
                    + preferencia_score(z, pisada, prioridad, terreno)
                ),
                -z["precioNum"],
            ),
        )[0]
    return sorted(pool, key=lambda z: z["precioNum"])[0]


def pick_comfort(pool, exclude_names, max_mxn):
    """REGLA 6 — identico a pickComfort() en index.html."""
    available = [z for z in pool if z["nombre"] not in exclude_names]
    in_budget = [z for z in available if z["precioNum"] <= max_mxn]
    base = in_budget if in_budget else available
    return sorted(base, key=lambda z: (-z["metricas"]["amortiguacion"], -z["precioNum"]))[0]


def pick_traction(pool, exclude_names, max_mxn):
    """REGLA 6 — identico a pickTraction() en index.html."""
    available = [z for z in pool if z["nombre"] not in exclude_names]
    in_budget = [z for z in available if z["precioNum"] <= max_mxn]
    base = in_budget if in_budget else available
    return sorted(base, key=lambda z: (-z["metricas"]["agarre"], -z["precioNum"]))[0]


def recomendar(
    catalogo,
    terreno,
    nivel,
    presupuesto,
    objetivo,
    humedad="",
    pisada="",
    prioridad="",
):
    """
    Replica completa de recomendar() en index.html — desde el bucket de
    terreno hasta las 3 recomendaciones finales con badge de rol y presupuesto.

    Args:
        catalogo: lista de dicts, tal como viene de catalogo.json
        terreno: 'montaña'|'roca'|'bosque'|'mixto'
        nivel: 'principiante'|'intermedio'|'avanzado'
        presupuesto: 'menos2000'|'2000-4000'|'mas4000'
        objetivo: valor de objetivoKeys (ej. 'tecnica','21K','competencia', etc.)
        humedad: ''|'seco'|'humedo'|'ambos' (opcional)
        pisada: ''|'neutral'|'pronador'|'supinador' (opcional)
        prioridad: ''|'ligereza'|'agarre'|'amortiguacion'|'estabilidad' (opcional)

    Returns:
        dict con 'recomendado', 'alternativa_comoda', 'alternativa_traccion'
        (cada uno el dict completo del zapato, o None si el catalogo esta vacio)
    """
    bucket = TERRAIN_BUCKET.get(terreno, "mixed_trail")

    # REGLA 1c: humedad expande el pool a mud_soft_ground
    buckets_objetivo = [bucket]
    if humedad in ("humedo", "ambos") and bucket != "mud_soft_ground":
        buckets_objetivo.append("mud_soft_ground")

    max_mxn = BUDGET_MAX.get(presupuesto, 4000)
    tolerance = BUDGET_TOLERANCE.get(presupuesto, 0.15)
    max_soft = 99999 if max_mxn == 99999 else round(max_mxn * (1 + tolerance))

    # Pool por bucket (terreno)
    pool_bucket = [z for z in catalogo if any(b in buckets_objetivo for b in z["bucket"])]

    # REGLA 1b: nivel y objetivo pesan en la seleccion, con escalera de relajacion
    # (objetivo es la señal mas fuerte — se relaja nivel primero)
    pool = [
        z for z in pool_bucket
        if nivel in (z.get("nivelKeys") or []) and objetivo in (z.get("objetivoKeys") or [])
    ]
    if len(pool) < 3:
        pool = [z for z in pool_bucket if objetivo in (z.get("objetivoKeys") or [])]
    if len(pool) < 3:
        pool = [z for z in pool_bucket if nivel in (z.get("nivelKeys") or [])]
    if len(pool) < 3:
        pool = pool_bucket

    # Fallback de presupuesto: si el bucket no tiene 3 opciones dentro de precio
    in_budget_from_bucket = [z for z in pool if z["precioNum"] <= max_mxn]
    if len(in_budget_from_bucket) < 3:
        nombres_pool = {z["nombre"] for z in pool}
        budget_alts = [
            z for z in catalogo
            if z["precioNum"] <= max_mxn and z["nombre"] not in nombres_pool
        ]
        pool = pool + budget_alts

    # Fallback general: mixed_trail si aun hay menos de 3
    if len(pool) < 3:
        nombres_pool = {z["nombre"] for z in pool}
        extras = [
            z for z in catalogo
            if "mixed_trail" in z["bucket"] and z["nombre"] not in nombres_pool
        ]
        pool = pool + extras

    if not pool:
        return {"recomendado": None, "alternativa_comoda": None, "alternativa_traccion": None}

    rec = pick_recommended(pool, max_mxn, pisada, prioridad, terreno)
    comfort = pick_comfort(pool, {rec["nombre"]} if rec else set(), max_mxn)
    traction = pick_traction(
        pool,
        {n for n in [rec["nombre"] if rec else None, comfort["nombre"] if comfort else None] if n},
        max_mxn,
    )

    def con_badges(z):
        if not z:
            return None
        return {**z, "budgetBadge": budget_badge(z, max_mxn, max_soft)}

    return {
        "recomendado": con_badges(rec),
        "alternativa_comoda": con_badges(comfort),
        "alternativa_traccion": con_badges(traction),
    }


if __name__ == "__main__":
    # Smoke test manual — no reemplaza la suite de paridad (test_shoe_scoring.py)
    catalogo = cargar_catalogo()
    resultado = recomendar(catalogo, terreno="bosque", nivel="intermedio",
                            presupuesto="2000-4000", objetivo="distancia")
    for rol, z in resultado.items():
        print(rol, "->", z["nombre"] if z else None)
