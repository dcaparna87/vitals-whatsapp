// ✅ Collect form data into an object
function collectVitalsData() {
  return {
    date: document.getElementById('dt').value,
    morning: {
      temp: document.getElementById('morning_temp').value,
      bp: document.getElementById('morning_bp').value,
      pr: document.getElementById('morning_pr').value,
      spo2: document.getElementById('morning_spo2').value
    },
    evening: {
      temp: document.getElementById('evening_temp').value,
      bp: document.getElementById('evening_bp').value,
      pr: document.getElementById('evening_pr').value,
      spo2: document.getElementById('evening_spo2').value
    },
    cappingEnabled: document.getElementById('enableCapping').checked,
    capping: {
      start: document.getElementById('capping_start').value,
      start_pr: document.getElementById('cap_start_pr').value,
      start_spo2: document.getElementById('cap_start_spo2').value,
      end: document.getElementById('capping_end').value,
      end_pr: document.getElementById('cap_end_pr').value,
      end_spo2: document.getElementById('cap_end_spo2').value
    },
    io: {
      input: document.getElementById('inputQty').value,
      output: document.getElementById('outputQty').value
    },
    misc: {
      motionPassed: document.getElementById('motionPassed').value,
      tSecretions: document.getElementById('tSecretions').value,
      oralSuction: document.getElementById('oral_suctions').value,
      rbs: document.getElementById('rbs').value
    },
    notes: {
      physio: document.getElementById('physio_notes').value,
      swallow: document.getElementById('swallow_notes').value,
      misc: document.getElementById('misc_notes').value
    },
    medications: Array.from(document.querySelectorAll('input[name="meds"]:checked')).map(cb => cb.value),
    timestamp: new Date().toISOString()
  };
}

// ✅ WhatsApp message builder
function sendWhatsApp() {
  const data = collectVitalsData();
  let message = `_Date: ${data.date}_\n\n`;

  message += `*Morning Vitals (8:00 AM):*\nTemp: ${data.morning.temp}°f,\nBP: ${data.morning.bp},\nPR: ${data.morning.pr} bpm,\nSpO2: ${data.morning.spo2}%\n\n`;
  message += `*Evening Vitals (8:00 PM):*\nTemp: ${data.evening.temp}°f,\nBP: ${data.evening.bp},\nPR: ${data.evening.pr} bpm,\nSpO2: ${data.evening.spo2}%\n\n`;

  if (data.cappingEnabled) {
    message += `Capping Start: ${data.capping.start}, PR: ${data.capping.start_pr}, SpO2: ${data.capping.start_spo2}%\n`;
    message += `Capping End: ${data.capping.end}, PR: ${data.capping.end_pr}, SpO2: ${data.capping.end_spo2}%\n\n`;
  }

  message += `*Notes:*\n*1. Input:* ${data.io.input} ml, *Output:* ${data.io.output} ml\n*2. Motion Passed:* ${data.misc.motionPassed}, Trachea Secretions: ${data.misc.tSecretions}, Oral Suction: ${data.misc.oralSuction}, RBS: ${data.misc.rbs}\n`;
  message += `*3. Physio:* ${data.notes.physio}\n*4. Swallow:* ${data.notes.swallow}\n*5. Misc:* ${data.notes.misc}\n`;

  if (data.medications.length > 0) {
    message += `*Medications:*\n${data.medications.map((m, i) => `${i+1}. ${m}`).join("\n")}\n`;
  }

  const phoneNumber = "919176580847"; // Replace with actual number
  window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`);
}

// ✅ BP Validation
function validateBPWrapper(event) {
  const inputField = event.target;
  const bpValue = inputField.value.trim();
  const pattern = /^\d{2,3}\/\d{2,3}$/;

  if (!pattern.test(bpValue)) {
    inputField.value = "";
    alert("Please enter BP in format 120/80");
    inputField.focus();
  }
}

function saveAndSend() {

// Before doing anything, first validate the form and then save and then send.
const form = document.getElementById("trackerForm");

  if (!form.checkValidity()) {
    alert("Please fill all required fields correctly before sending.");
    form.reportValidity();
    return;
  }
  // Call save from data.js
  saveVitalsData();
  // Call send from main.js
  sendWhatsApp();
}


document.getElementById("morning_bp").addEventListener("blur", validateBPWrapper);
document.getElementById("evening_bp").addEventListener("blur", validateBPWrapper);

// ✅ Enable/disable capping fieldset
const enableCapping = document.getElementById('enableCapping');
const cappingFieldset = document.getElementById('cappingFieldset');
const cappingInputs = cappingFieldset.querySelectorAll('input');

enableCapping.addEventListener('change', function() {
  if (this.checked) {
    cappingFieldset.disabled = false;
    cappingInputs.forEach(input => input.required = true);
  } else {
    cappingFieldset.disabled = true;
    cappingInputs.forEach(input => input.required = false);
  }
});
