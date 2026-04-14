function recomendar() {
    const terreno = document.getElementById('terrain').value;
    const presupuesto = document.getElementById('budget').value;
    const objetivo = document.getElementById('objective').value;
    const nivel = document.getElementById('level').value;
    const talla = document.getElementById('shoeSize').value;

    if (!terreno || !presupuesto || !objetivo || !nivel || !talla) {
        alert('Por favor completa todos los campos.');
        return;
    }

    const presupuestoMax = { 'menos2000': 2000, '2000-4000': 4000, 'mas4000': 99999 };
    const maxMXN = presupuestoMax[presupuesto] || 4000;

    const catalogo = [
        {
            nombre: 'Salomon Speedcross 6',
            marca: 'Salomon',
            precio: '$2,800 MXN',
            precioNum: 2800,
            descripcion: 'Suela aggressive con taco profundo, ideal para terreno blando y mixto. Excelente tracción y soporte lateral.',
            terreno: 'Montaña / Mixto',
            terrenoKeys: ['montaña', 'mixto', 'bosque']
        },
        {
            nombre: 'Hoka Speedgoat 5',
            marca: 'Hoka',
            precio: '$3,500 MXN',
            precioNum: 3500,
            descripcion: 'Máxima amortiguación para distancias largas. Ideal para ultras y corredores que priorizan comodidad sobre velocidad.',
            terreno: 'Distancia larga / Todo terreno',
            terrenoKeys: ['montaña', 'mixto', 'bosque', 'roca']
        },
        {
            nombre: 'Brooks Cascadia 17',
            marca: 'Brooks',
            precio: '$2,200 MXN',
            precioNum: 2200,
            descripcion: 'Balance perfecto entre tracción y amortiguación. Versátil para principiantes e intermedios en terreno variado.',
            terreno: 'Mixto / Bosque',
            terrenoKeys: ['mixto', 'bosque', 'montaña']
        },
        {
            nombre: 'Inov-8 Trailfly G 270',
            marca: 'Inov-8',
            precio: '$3,200 MXN',
            precioNum: 3200,
            descripcion: 'Suela de grafeno para agarre extremo en roca. Muy ligero, para corredores técnicos y roca seca.',
            terreno: 'Roca / Técnico',
            terrenoKeys: ['roca', 'mixto']
        },
        {
            nombre: 'Salomon Ultra Glide 2',
            marca: 'Salomon',
            precio: '$3,100 MXN',
            precioNum: 3100,
            descripcion: 'Suela agresiva con tacos cortos, ideal para rutas de trail ligero y ascensos cortos.',
            terreno: 'Trail ligero',
            terrenoKeys: ['bosque', 'traje']
        },
        {
            nombre: 'New Balance Fresh Foam Trail',
            marca: 'New Balance',
            precio: '$2,500 MXN',
            precioNum: 2500,
            descripcion: 'Amplio confort con amortiguación y suela versátil, apto para distancias largas y terrenos mixtos.',
            terreno: 'Distancia larga / Todo terreno',
            terrenoKeys: ['montaña', 'mixto', 'roca', 'bosque']
        }
    ];

    let candidatos = catalogo.filter(z =>
        z.terrenoKeys.includes(terreno) && z.precioNum <= maxMXN
    );

    if (candidatos.length === 0) {
        candidatos = catalogo.filter(z => z.terrenoKeys.includes(terreno));
    }
    if (candidatos.length === 0) {
        candidatos = [...catalogo];
    }

    candidatos.sort((a, b) => {
        const aMatch = a.terrenoKeys[0] === terreno ? -1 : 0;
        const bMatch = b.terrenoKeys[0] === terreno ? -1 : 0;
        return aMatch - bMatch || a.precioNum - b.precioNum;
    });

    const zapatos = candidatos.slice(0, 3);

    const equipo = ['Medias técnicas de trail (anti-ampolla)', 'Hidratación: botella suave 500ml mínimo'];
    if (objetivo === '21K' || objetivo === 'ultra') {
        equipo.push('Chaleco de hidratación (2L+)', 'Geles energéticos / nutrición de carrera');
    }
    if (objetivo === 'ultra') {
        equipo.push('Bastones de trail (carbono o aluminio)', 'Kit de emergencia (manta, silbato, linterna)', 'Gorra y protector solar');
    }
    if (terreno === 'roca') {
        equipo.push('Polainas anti-piedra');
    }

    const presupuestoLabel = { 'menos2000': 'Menos de $2,000', '2000-4000': '$2,000–$4,000', 'mas4000': 'Más de $4,000' };

    const result = {
        zapatos: zapatos.map(z => ({
            nombre: z.nombre,
            marca: z.marca,
            precio: z.precio,
            descripcion: z.descripcion,
            terreno: z.terreno
        })),
        equipo,
        objetivo,
        terreno,
        presupuesto: presupuestoLabel[presupuesto] || presupuesto
    };

    localStorage.setItem('trailResult', JSON.stringify(result));
    window.location.href = 'resultados.html';
}