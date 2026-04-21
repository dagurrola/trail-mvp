function recomendar() {
    const terreno = document.getElementById('terrain').value;
    const presupuesto = document.getElementById('budget').value;
    const objetivoPrincipal = document.getElementById('objectiveMain').value;
    const subObjetivo = document.getElementById('objectiveSub').value;
    const nivel = document.getElementById('level').value;
    const talla = document.getElementById('shoeSize').value;

    if (!terreno || !presupuesto || !objetivoPrincipal || !subObjetivo || !nivel || !talla) {
        alert('Por favor completa todos los campos.');
        return;
    }

    const presupuestoMax = { 'menos2000': 2000, '2000-4000': 4000, 'mas4000': 9999999 };
    const maxMXN = presupuestoMax[presupuesto] || 4000;

    const catalogo = [
        {
            nombre: 'Salomon Speedcross 6',
            marca: 'Salomon',
            precio: 2800,
            precioStr: '$2,800 MXN',
            descripcion: 'Suela aggressive con taco profundo, ideal para terreno blando y mixto. Excelente tracción y soporte lateral.',
            tags: ['montaña', 'mixto', 'bosque']
        },
        {
            nombre: 'Hoka Speedgoat 5',
            marca: 'Hoka',
            precio: 3500,
            precioStr: '$3,500 MXN',
            descripcion: 'Máxima amortiguación para distancias largas. Ideal para ultras y corredores que priorizan comodidad sobre velocidad.',
            tags: ['montaña', 'mixto', 'bosque', 'roca']
        },
        {
            nombre: 'Brooks Cascadia 17',
            marca: 'Brooks',
            precio: 2200,
            precioStr: '$2,200 MXN',
            descripcion: 'Balance perfecto entre tracción y amortiguación. Versátil para principiantes e intermedios en terreno variado.',
            tags: ['mixto', 'bosque', 'montaña']
        },
        {
            nombre: 'Inov-8 Trailfly G 270',
            marca: 'Inov-8',
            precio: 3200,
            precioStr: '$3,200 MXN',
            descripcion: 'Suela de grafeno para agarre extremo en roca. Muy ligero, para corredores técnicos y roca seca.',
            tags: ['roca', 'mixto']
        },
        {
            nombre: 'Salomon Ultra Glide 2',
            marca: 'Salomon',
            precio: 3100,
            precioStr: '$3,100 MXN',
            descripcion: 'Suela agresiva con tacos cortos, ideal para rutas de trail ligero y ascensos cortos.',
            tags: ['bosque', 'traje']
        },
        {
            nombre: 'New Balance Fresh Foam Trail',
            marca: 'New Balance',
            precio: 2500,
            precioStr: '$2,500 MXN',
            descripcion: 'Amplio confort con amortiguación y suela versátil, apto para distancias largas y terrenos mixtos.',
            tags: ['montaña', 'mixto', 'roca', 'bosque']
        },
        {
            nombre: 'Altra Lone Peak 5',
            marca: 'Altra',
            precio: 2600,
            precioStr: '$2,600 MXN',
            descripcion: 'Zero Drop con amortiguación suave, perfecta para montañas ligeras y caminos de grava.',
            tags: ['montaña', 'bosque', 'mixto']
        },
        {
            nombre: 'La Sportiva Bushido II',
            marca: 'La Sportiva',
            precio: 3300,
            precioStr: '$3,300 MXN',
            descripcion: 'Protección de ascenso y tracción en terreno mixto, ideal para escalada ligera y montaña.',
            tags: ['montaña', 'roca', 'traje']
        }
    ];

    const terrenoLower = terreno.toLowerCase();

    let candidatos = catalogo.filter(z =>
        z.tags.includes(terrenoLower) && z.precio <= maxMXN
    );

    if (candidatos.length === 0) {
        candidatos = catalogo.filter(z => z.tags.includes(terrenoLower));
    }
    if (candidatos.length === 0) {
        candidatos = [...catalogo];
    }

    candidatos.sort((a, b) => {
        const aMatch = a.tags[0] === terrenoLower ? -1 : 0;
        const bMatch = b.tags[0] === terrenoLower ? -1 : 0;
        return aMatch - bMatch || a.precio - b.precio;
    });

    const zapatos = candidatos.slice(0, 3);

    const equipo = ['Medias técnicas de trail (anti-ampolla)', 'Hidratación: botella suave 500ml mínimo'];

    if (['montaña', 'roca'].some(t => terrenoLower.includes(t))) {
        equipo.push('Bastones de trail', 'Polainas anti-piedra');
    }
    if (['bosque', 'mixto'].some(t => terrenoLower.includes(t))) {
        equipo.push('Medias técnicas de trail', 'Hidratación: botella suave 500ml mínimo');
    }
    if (subObjetivo && subObjetivo.toLowerCase().includes('ultra')) {
        equipo.push('Chaleco de hidratación (2L+)', 'Geles energéticos / nutrición de carrera');
    }

    const presupuestoLabel = { 'menos2000': 'Menos de $2,000', '2000-4000': '$2,000–$4,000', 'mas4000': 'Más de $4,000' };

    const resultado = {
        zapatos,
        equipo,
        objetivoPrincipal,
        subObjetivo,
        terreno,
        presupuesto: presupuestoLabel[presupuesto] || presupuesto
    };

    localStorage.setItem('trailResult', JSON.stringify(resultado));
    generarHTML(resultado);
}

function generarHTML({ zapatos, equipo, objetivoPrincipal, subObjetivo, terreno, presupuesto }) {
    const container = document.getElementById('resultContainer');

    const header = document.createElement('h2');
    header.textContent = 'Recomendaciones';
    container.appendChild(header);

    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'cards';
    zapatos.forEach(zapato => {
        const card = document.createElement('div');
        card.className = 'card';

        const title = document.createElement('h3');
        title.textContent = `${zapato.nombre} - ${zapato.marca}`;

        const price = document.createElement('p');
        price.textContent = zapato.precioStr;

        const desc = document.createElement('p');
        desc.textContent = zapato.descripcion;

        card.appendChild(title);
        card.appendChild(price);
        card.appendChild(desc);

        cardsContainer.appendChild(card);
    });
    container.appendChild(cardsContainer);

    const equipoSection = document.createElement('div');
    equipoSection.className = 'equipo';
    const equipoHeader = document.createElement('h3');
    equipoHeader.textContent = 'Equipo recomendado';
    equipoSection.appendChild(equipoHeader);

    const ulEquipo = document.createElement('ul');
    equipo.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ulEquipo.appendChild(li);
    });
    equipoSection.appendChild(ulEquipo);
    container.appendChild(equipoSection);

    const comparativa = document.createElement('div');
    comparativa.className = 'comparativa';
    const compHeader = document.createElement('h3');
    compHeader.textContent = 'Comparativa de precios';
    comparativa.appendChild(compHeader);

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const trHeader = document.createElement('tr');
    ['Producto', 'Marca', 'Precio'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        trHeader.appendChild(th);
    });
    thead.appendChild(trHeader);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    zapatos.forEach(zapato => {
        const tr = document.createElement('tr');

        const tdName = document.createElement('td');
        tdName.textContent = zapato.nombre;
        const tdMarca = document.createElement('td');
        tdMarca.textContent = zapato.marca;
        const tdPrecio = document.createElement('td');
        tdPrecio.textContent = zapato.precioStr;

        tr.appendChild(tdName);
        tr.appendChild(tdMarca);
        tr.appendChild(tdPrecio);
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    comparativa.appendChild(table);
    container.appendChild(comparativa);

    const info = document.createElement('p');
    info.textContent = `Objetivo: ${objetivoPrincipal}${subObjetivo ? ' - Subobjetivo: ' + subObjetivo : ''}. Terreno: ${terreno}. Presupuesto: ${presupuesto}.`;
    container.appendChild(info);
}

document.getElementById('recommendBtn').addEventListener('click', recomendar);