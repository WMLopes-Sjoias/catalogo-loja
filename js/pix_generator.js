function generatePixPayload(chavePix, nomeBeneficiario, cidadeBeneficiario, valor, descricao) {
    const pixKey = chavePix.replace(/[^0-9]/g, ''); // Remove non-numeric characters for CNPJ
    const merchantName = nomeBeneficiario;
    const merchantCity = cidadeBeneficiario;
    const transactionAmount = valor.toFixed(2);
    const txid = '***'; // Transaction ID, can be dynamic if needed

    // EMV QR Code Payload (BR Code)
    let payload = '';

    // Payload Format Indicator (ID 00)
    payload += '001401';

    // Merchant Account Information (ID 26)
    payload += '26' + ('0014BR.GOV.BCB.PIX' + '01' + (pixKey.length < 10 ? '01' : '02') + pixKey).length.toString().padStart(2, '0') + '0014BR.GOV.BCB.PIX' + '01' + (pixKey.length < 10 ? '01' : '02') + pixKey;

    // Merchant Category Code (ID 52)
    payload += '52040000';

    // Transaction Currency (ID 53) - BRL
    payload += '5303986';

    // Transaction Amount (ID 54)
    payload += '54' + transactionAmount.length.toString().padStart(2, '0') + transactionAmount;

    // Country Code (ID 58)
    payload += '5802BR';

    // Merchant Name (ID 59)
    payload += '59' + merchantName.length.toString().padStart(2, '0') + merchantName;

    // Merchant City (ID 60)
    payload += '60' + merchantCity.length.toString().padStart(2, '0') + merchantCity;

    // CRC16 (ID 63)
    payload += '6304';

    // Calculate CRC16
    const crc = crc16(payload + '6304');
    payload += crc;

    return payload;
}

// Function to calculate CRC16 (from PIX documentation)
function crc16(data) {
    let polynomial = 0x1021;
    let result = 0xFFFF;

    for (let i = 0; i < data.length; i++) {
        result ^= (data.charCodeAt(i) << 8);
        for (let j = 0; j < 8; j++) {
            if ((result & 0x8000) !== 0) {
                result = (result << 1) ^ polynomial;
            } else {
                result <<= 1;
            }
        }
    }
    return (result & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}
