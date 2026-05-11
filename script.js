document.addEventListener('DOMContentLoaded', function() {
    const fechaIni = document.getElementById('fechaIni');
    const meses = document.getElementById('meses');
    const fechaFin = document.getElementById('fechaFin');
    const salario = document.getElementById('salario');
    const jornada = document.getElementById('jornada');
    const form = document.getElementById('contratoForm');

    // Auto-calcular fecha fin
    function calcularFechaFin() {
        if (fechaIni.value && meses.value) {
            const ini = new Date(fechaIni.value);
            ini.setMonth(ini.getMonth() + parseInt(meses.value));
            fechaFin.value = ini.toISOString().split('T')[0];
        }
    }
    fechaIni.addEventListener('change', calcularFechaFin);
    meses.addEventListener('input', calcularFechaFin);

    // Validar SMLMV y jornada
    salario.addEventListener('input', () => {
        if (parseInt(salario.value) < 1423500) salario.setCustomValidity('Mínimo SMLMV 2026: $1.423.500');
        else salario.setCustomValidity('');
    });
    jornada.addEventListener('input', () => {
        if (parseInt(jornada.value) > 47) jornada.setCustomValidity('Máx 47 horas semanales CST');
        else jornada.setCustomValidity('');
    });

    form.addEventListener('submit', e => e.preventDefault());
});

function generarContratoFijo() {
    const chks = ['chk1', 'chk2', 'chk3', 'chk4'];
    const todosSi = chks.every(id => document.getElementById(id).checked);
    const form = document.getElementById('contratoForm');
    const meses = parseInt(document.getElementById('meses').value);

    if (!form.checkValidity() || !todosSi || meses > 48) {
        const msg = document.getElementById('mensaje');
        msg.textContent = '❌ Error: Completa campos, checklist 100% Sí y máx 48 meses (Ley 2466/2025)';
        msg.style.background = '#e74c3c'; msg.style.color = 'white'; msg.style.display = 'block';
        setTimeout(() => msg.style.display = 'none', 5000);
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    doc.setFontSize(18); doc.setFont('helvetica', 'bold');
    doc.text('CONTRATO TRABAJO Fijo - CAPITAL INVESTMENTS S.A.S.', 20, 25);
    doc.setFontSize(12); doc.setFont('helvetica', 'normal');
    doc.text(`Empleador NIT: ${document.getElementById('nitEmp').value}`, 20, 40);
    doc.text(`Trabajador: ${document.getElementById('nomTrab').value} - ${document.getElementById('ccTrab').value}`, 20, 50);
    doc.text(`Cargo: ${document.getElementById('cargo').value}`, 20, 60);
    doc.text(`Duración: ${document.getElementById('meses').value} meses (${document.getElementById('fechaIni').value} a ${document.getElementById('fechaFin').value})`, 20, 70);
    doc.text(`Salario: $${document.getElementById('salario').value} | Jornada: ${document.getElementById('jornada').value}h sem.`, 20, 80);
    doc.text(`SS: EPS ${document.getElementById('eps').value} | Pensión ${document.getElementById('pension').value} | ARL ${document.getElementById('arl').value}`, 20, 90);
    doc.text('Checklist: 100% Cumplido | Cláusulas CST/Ley 2466/2025', 20, 100);
    doc.text('Firmas: ________________ Empleador | ________________ Trabajador | Testigos: __ __', 20, 120);
    doc.save(`contrato-fijo-${document.getElementById('nomTrab').value.replace(/\s+/g, '_')}_2026.pdf`);

    const msg = document.getElementById('mensaje');
    msg.textContent = '✅ PDF generado correctamente! Revisa, firma digital y registra PILA.';
    msg.style.background = '#27ae60'; msg.style.color = 'white'; msg.style.display = 'block';
    setTimeout(() => msg.style.display = 'none', 5000);
}
