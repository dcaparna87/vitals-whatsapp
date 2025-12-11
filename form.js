// Utility: get URL param
function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

// Utility: collect meds
function collectMedications() {
  const meds = [];
  document.querySelectorAll('input[name="meds"]:checked').forEach(cb => meds.push(cb.value));
  return meds;
}

// Utility: set meds from array
function setMedications(medsArr = []) {
  const set = new Set(medsArr);
  document.querySelectorAll('input[name="meds"]').forEach(cb => {
    cb.checked = set.has(cb.value);
  });
}

// Enable/disable capping details
function setupCappingToggle() {
  const toggle = document.getElementById('enableCapping');
  const fieldset = document.getElementById('cappingFieldset');
  if (!toggle || !fieldset) return;
  const apply = () => fieldset.disabled = !toggle.checked;
  toggle.addEventListener('change', apply);
  apply();
}

// Build record object from form
function buildRecordFromForm() {
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
    capping: {
      enabled: document.getElementById('enableCapping')?.checked || false,
      start: document.getElementById('capping_start')?.value || '',
      start_pr: document.getElementById('cap_start_pr')?.value || '',
      start_spo2: document.getElementById('cap_start_spo2')?.value || '',
      end: document.getElementById('capping_end')?.value || '',
      end_pr: document.getElementById('cap_end_pr')?.value || '',
      end_spo2: document.getElementById('cap_end_spo2')?.value || ''
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
    medications: collectMedications()
  };
}

// Prefill form from data
function fillForm(data) {
  document.getElementById('dt').value = data.date || '';
  document.getElementById('dt').readOnly = true; // read-only in edit mode

  // Morning
  document.getElementById('morning_temp').value = data.morning?.temp || '';
  document.getElementById('morning_bp').value = data.morning?.bp || '';
  document.getElementById('morning_pr').value = data.morning?.pr || '';
  document.getElementById('morning_spo2').value = data.morning?.spo2 || '';

  // Evening
  document.getElementById('evening_temp').value = data.evening?.temp || '';
  document.getElementById('evening_bp').value = data.evening?.bp || '';
  document.getElementById('evening_pr').value = data.evening?.pr || '';
  document.getElementById('evening_spo2').value = data.evening?.spo2 || '';

  // Capping
  if (data.capping?.enabled) {
    document.getElementById('enableCapping').checked = true;
  }
  document.getElementById('capping_start').value = data.capping?.start || '';
  document.getElementById('cap_start_pr').value = data.capping?.start_pr || '';
  document.getElementById('cap_start_spo2').value = data.capping?.start_spo2 || '';
  document.getElementById('capping_end').value = data.capping?.end || '';
  document.getElementById('cap_end_pr').value = data.capping?.end_pr || '';
  document.getElementById('cap_end_spo2').value = data.capping?.end_spo2 || '';

  // IO
  document.getElementById('inputQty').value = data.io?.input || '';
  document.getElementById('outputQty').value = data.io?.output || '';

  // Misc
  document.getElementById('motionPassed').value = data.misc?.motionPassed || '';
  document.getElementById('tSecretions').value = data.misc?.tSecretions || '';
  document.getElementById('oral_suctions').value = data.misc?.oralSuction || '';
  document.getElementById('rbs').value = data.misc?.rbs || '';

  // Notes
  document.getElementById('physio_notes').value = data.notes?.physio || '';
  document.getElementById('swallow_notes').value = data.notes?.swallow || '';
  document.getElementById('misc_notes').value = data.notes?.misc || '';

  // Medications
  setMedications(data.medications || []);

  // Apply capping disabled/enabled state based on checkbox
  setupCappingToggle();
}

// Save handler (new or edit)
function saveRecord() {
  const docId = getParam('id'); // if present, edit mode
  const record = buildRecordFromForm();

  if (!record.date) {
    alert('Please select a date.');
    return;
  }

  if (docId) {
    // Update existing record
    db.collection('vitals').doc(docId).update(record)
      .then(() => {
        alert('Record updated successfully.');
        window.location.href = 'records.html';
      })
      .catch(err => console.error('Error updating:', err));
  } else {
    // Create new record
    db.collection('vitals').add(record)
      .then(() => {
        alert('Record saved successfully.');
        sendWhatsApp();   // ✅ send message after new save
        window.location.href = 'index.html';   // ✅ go back to Home
      })
      .catch(err => console.error('Error saving:', err));
  }
}

// On load: detect edit mode and prefill
document.addEventListener('DOMContentLoaded', () => {
  setupCappingToggle();
  const docId = getParam('id');
  const saveBtn = document.getElementById("saveAndSendBtn");

  if (docId) {
    db.collection('vitals').doc(docId).get().then(doc => {
      if (doc.exists) {
        saveBtn.textContent = "Save";
        fillForm(doc.data());
      } else {
        alert('Record not found.');
      }
    });
  } else {
    // New mode: ensure date is editable
    saveBtn.textContent = "Save & Send";
    const dt = document.getElementById('dt');
    if (dt) dt.readOnly = false;
  }
  
});

function sendWhatsApp() {
  const data = buildRecordFromForm();
  let message = `_Date: ${data.date}_\n\n`;

  message += `*Morning Vitals (8:00 AM):*\nTemp: ${data.morning.temp}°f,\nBP: ${data.morning.bp},\nPR: ${data.morning.pr} bpm,\nSpO2: ${data.morning.spo2}%\n\n`;
  message += `*Evening Vitals (8:00 PM):*\nTemp: ${data.evening.temp}°f,\nBP: ${data.evening.bp},\nPR: ${data.evening.pr} bpm,\nSpO2: ${data.evening.spo2}%\n\n`;

  if (data.cappingEnabled) {
    message += `Capping Start: ${data.capping.start}, PR: ${data.capping.start_pr}, SpO2: ${data.capping.start_spo2}%\n`;
    message += `Capping End: ${data.capping.end}, PR: ${data.capping.end_pr}, SpO2: ${data.capping.end_spo2}%\n\n`;
  }

  message += `*Notes:*\n*1. Input:* ${data.io.input} ml, *Output:* ${data.io.output} ml\n*2. Motion Passed:* ${data.misc.motionPassed},\n*3. Trachea Secretions:* ${data.misc.tSecretions},\n*4. Oral Suction:* ${data.misc.oralSuction},\n*5. RBS:* ${data.misc.rbs}\n`;
  message += `*6. Physio:* ${data.notes.physio}\n*7. Swallow:* ${data.notes.swallow}\n*8. Misc:* ${data.notes.misc}\n`;

  if (data.medications.length > 0) {
    message += `*Medications:*\n${data.medications.map((m, i) => `${i+1}. ${m}`).join("\n")}\n`;
  }

  const phoneNumber = "919176580847"; // Replace with actual number
  window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`);
}
