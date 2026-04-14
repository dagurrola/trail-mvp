const form = document.querySelector('form');
  const recomendaciones = [];
  
  // Datos de calzado con precios en MXN
  const shoes = [
    {nombre: 'Salomon Speedcross 6', precio: 2800, terreno: 'mixto/montaña', caracteristicas: 'soporte medio, agarre en roca'},
    {nombre: 'Hoka Speedgoat 5', precio: 3500, terreno: 'distancia larga', caracteristicas: 'cushioning alto, amortiguación'},
    {nombre: 'Brooks Cascadia 17', precio: 2200, terreno: 'mixto', caracteristicas: 'soporte medio, amortiguación'},
    {nombre: 'Inov-8 Trailfly G 270', precio: 3200, terreno: 'roca', caracteristicas: 'agarre extremo, tracción'}
  ];
  
  // Datos de equipo prioritario
  const equipoPrioritario = [
    {nombre: 'Hidratación', tipo: 'botella + filtro', descripcion: 'Mínimo 1L capacidad, filtro para agua de río'},
    {nombre: 'Medias', tipo: 'mangas largas', descripcion: 'Transpirables, con refuerzo en talones'},
    {nombre: 'Poles', tipo: 'aluminio 40cm', descripcion: 'Para ultra de 30km+', disponible: true}
  ];
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Obtener valores del formulario
    const terreno = document.getElementById('terreno').value;
    const presupuesto = parseInt(document.getElementById('presupuesto').value);
    const objetivo = document.getElementById('objetivo').value;
    
    // Lógica de recomendación
    const recomendacionesFiltradas = shoes.filter(shoe => {
      return (shoe.terreno.includes(terreno) || 
              shoe.caracteristicas.includes(terreno)) && 
             shoe.precio <= presupuesto;
    });
    
    // Seleccionar top 2 recomendaciones
    recomendacionesFiltradas.sort((a, b) => a.precio - b.precio);
    recomendacionesFiltradas.splice(2);
    
    // Generar lista de equipo prioritario
    const equipo = [...equipoPrioritario];
    if (objetivo === 'ultra') {
      equipo.push({nombre: 'Poles', tipo: 'aluminio 40cm', descripcion: 'Para ultra de 30km+'});
    }
    
    // Guardar datos en localStorage
    localStorage.setItem('recomendaciones', JSON.stringify(recomendacionesFiltradas));
    localStorage.setItem('equipoPrioritario', JSON.stringify(equipo));
    
    // Redirigir a resultados
    window.location.href = 'resultados.html';
  });
})();