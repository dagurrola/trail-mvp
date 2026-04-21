function recomendar() {
    const terreno = document.getElementById('terrain').value.toLowerCase();
    const presupuesto = document.getElementById('budget').value;
    const objetivoPrincipal = document.getElementById('objectiveMain').value;
    const subObjetivo = document.getElementById('objectiveSub').value;
    const level = document.getElementById('level').value;
    const talla = document.getElementById('shoeSize').value;

    if (!terreno || !presupuesto || !objetivoPrincipal || !subObjetivo || !level || !talla) {
        alert('Por favor completa todos los campos.');
        return;
    }

    const maxMXN = { 'menos2000': 2000, '2000-4000': 4000, 'mas4000': 99999 }[presupuesto] || 4000;

    const catalogo = [
        {
            nombre: 'Salomon Speedcross 6',
            marca: 'Salomon',
            precio: '$2,800 MXN',
            precioNum: 2800,
            descripcion: 'Suela aggressive con taco profundo, ideal para terreno blando y mixto. Excelente tracción y soporte lateral.',
            terreno: 'Montaña / Mixto',
            terrenoKeys: ['montaña', 'mixto', 'bosque'],
            tags: []
        },
        {
            nombre: 'Hoka Speedgoat 5',
            marca: 'Hoka',
            precio: '$3,500 MXN',
            precioNum: 3500,
            descripcion: 'Máxima amortiguación para distancias largas. Ideal para ultras y corredores que priorizan comodidad sobre velocidad.',
            terreno: 'Distancia larga / Todo terreno',
            terrenoKeys: ['montaña', 'mixto', 'bosque', 'roca'],
            tags: []
        },
        {
            nombre: 'Brooks Cascadia 17',
            marca: 'Brooks',
            precio: '$2,200 MXN',
            precioNum: 2200,
            descripcion: 'Balance perfecto entre tracción y amortiguación. Versátil para principiantes e intermedios en terreno variado.',
            terreno: 'Mixto / Bosque',
            terrenoKeys: ['mixto', 'bosque', 'montaña'],
            tags: []
        },
        {
            nombre: 'Inov-8 Trailfly G 270',
            marca: 'Inov-8',
            precio: '$3,200 MXN',
            precioNum: 3200,
            descripcion: 'Suela de grafeno para agarre extremo en roca. Muy ligero, para corredores técnicos y roca seca.',
            terreno: 'Roca / Técnico',
            terrenoKeys: ['roca', 'mixto'],
            tags: []
        },
        {
            nombre: 'Salomon Ultra Glide 2',
            marca: 'Salomon',
            precio: '$3,100 MXN',
            precioNum: 3100,
            descripcion: 'Suela agresiva con tacos cortos, ideal para rutas de trail ligero y ascensos cortos.',
            terreno: 'Trail ligero',
            terrenoKeys: ['bosque', 'traje'],
            tags: []
        },
        {
            nombre: 'New Balance Fresh Foam Trail',
            marca: 'New Balance',
            precio: '$2,500 MXN',
            precioNum: 2500,
            descripcion: 'Amplio confort con amortiguación y suela versátil, apto para distancias largas y terrenos mixtos.',
            terreno: 'Distancia larga / Todo terreno',
            terrenoKeys: ['montaña', 'mixto', 'roca', 'bosque'],
            tags: []
        }
    ];

    let candidatos = catalogo.filter(item =>
        item.terrenoKeys.includes(terreno) && item.precioNum <= maxMXN
    );

    if (candidatos.length === 0) {
        candidatos = catalogo.filter(item => item.terrenoKeys.includes(terreno));
    }
    if (candidatos.length === 0) {
        candidatos = [...catalogo];
    }

    candidatos.sort((a, b) => a.precioNum - b.precioNum);

    const zapatos = candidatos.slice(0, 3);

    const equipo = ['Medias técnicas de trail (anti-ampolla)', 'Hidratación: botella suave 500ml mínimo'];

    if (['montaña', 'roca'].some(t => terreno.includes(t))) {
        equipo.push('Bastones de trail', 'Polainas anti-piedra');
    }
    if (['bosque', 'mixto'].some(t => terreno.includes(t))) {
        equipo.push('Medias técnicas de trail', 'Hidratación: botella suave 500ml mínimo');
    }
    if (subObjetivo && subObjetivo.toLowerCase().includes('ultra')) {
        equipo.push('Chaleco de hidratación (2L+)', 'Geles energéticos / nutrición de carrera');
    }

    const presupuestoLabel = {
        'menos2000': 'Menos de $2,000',
        '2000-4000': '$2,000–$4,000',
        'mas4000': 'Más de $4,000'
    };

    const result = {
        zapatos: zapatos.map(z => ({
            nombre: z.nombre,
            marca: z.marca,
            precio: z.precio,
            descripcion: z.descripcion,
            terreno: z.terreno
        })),
        equipo,
        objetivoPrincipal,
        subObjetivo,
        terreno,
        presupuesto: presupuestoLabel[presupuesto] || presupuesto
    };

    localStorage.setItem('trailResult', JSON.stringify(result));
    window.location.href = 'resultados.html';
}