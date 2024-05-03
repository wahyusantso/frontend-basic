const submitAction = document.getElementById('formDataDiri');

submitAction.addEventListener('submit', function(event) {
    const inputNama = document.getElementById('inputNama').value;
    const inputDomisili = document.getElementById('inputDomisili').value;
    const hiddenMessage = `halo, ${inputNama}. Bagaimana cuacanya di ${inputDomisili}?`;
    
    document.getElementById('messageAfterSubmit').innerText = hiddenMessage;
    event.preventDefault();
    // Ketika kita melakukan proses submit pada form, halaman web akan melakukan proses refresh.
    // Nah, event.preventDefault() akan mencegah proses refresh tersebut.
});