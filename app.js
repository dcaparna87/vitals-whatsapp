let savedData = [];
//Validate BP
document.getElementById("morning_bp").addEventListener("blur", validateBPWrapper);
document.getElementById("evening_bp").addEventListener("blur", validateBPWrapper);

//Validate Temp
//document.getElementById("morning_temp").addEventListener("blur", validateBPWrapper);
//document.getElementById("evening_temp").addEventListener("blur", validateBPWrapper);

//Validate PR
//document.getElementById("morning_pr").addEventListener("blur", validateBPWrapper);
//document.getElementById("evening_pr").addEventListener("blur", validateBPWrapper);
//document.getElementById("cap_start_pr").addEventListener("blur", validateBPWrapper);
//document.getElementById("cap_end_pr").addEventListener("blur", validateBPWrapper);


//Validate SpO2
//document.getElementById("morning_spo2").addEventListener("blur", validateBPWrapper);
//document.getElementById("evening_spo2").addEventListener("blur", validateBPWrapper);
//document.getElementById("cap_start_spo2").addEventListener("blur", validateBPWrapper);
//document.getElementById("cap_end_spo2").addEventListener("blur", validateBPWrapper);


function loadPage(page) {
  document.getElementById('contentFrame').src = page;
}

function addMedication() {
  const container = document.getElementById("medicationsList");
  const div = document.createElement("div");
  div.innerHTML = `
    <input type="text" placeholder="Name" class="medName" />
    <input type="text" placeholder="Dose" class="medDose" />
    <input type="text" placeholder="Time" class="medTime" />
  `;
  container.appendChild(div);
}

//Save and Load Vitals 
function saveVitalsData() {
  const data = {
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
    notes: {
      physio: document.getElementById('physio_notes').value,
      swallow: document.getElementById('swallow_notes').value,
      suctions: document.getElementById('oral_suctions').value
    }
  };

  localStorage.setItem('vitalsData', JSON.stringify(data));
  alert('Vitals data saved locally!');
}

function loadVitalsData() {
  const saved = localStorage.getItem('vitalsData');
  if (saved) {
    const data = JSON.parse(saved);
    document.getElementById('dt').value = data.date || '';
    document.getElementById('morning_temp').value = data.morning.temp || '';
    document.getElementById('morning_bp').value = data.morning.bp || '';
    document.getElementById('morning_pr').value = data.morning.pr || '';
    document.getElementById('morning_spo2').value = data.morning.spo2 || '';
    document.getElementById('evening_temp').value = data.evening.temp || '';
    document.getElementById('evening_bp').value = data.evening.bp || '';
    document.getElementById('evening_pr').value = data.evening.pr || '';
    document.getElementById('evening_spo2').value = data.evening.spo2 || '';
    document.getElementById('capping_start').value = data.capping.start || '';
    document.getElementById('cap_start_pr').value = data.capping.start_pr || '';
    document.getElementById('cap_start_spo2').value = data.capping.start_spo2 || '';
    document.getElementById('capping_end').value = data.capping.end || '';
    document.getElementById('cap_end_pr').value = data.capping.end_pr || '';
    document.getElementById('cap_end_spo2').value = data.capping.end_spo2 || '';
    document.getElementById('inputQty').value = data.io.input || '';
    document.getElementById('outputQty').value = data.io.output || '';
    document.getElementById('physio_notes').value = data.notes.physio || '';
    document.getElementById('swallow_notes').value = data.notes.swallow || '';
    document.getElementById('oral_suctions').value = data.notes.suctions || '';
  }
}

window.onload = function () {
  if (document.getElementById('trackerForm')) {
    loadVitalsData();
  }
};

//End of Save and Load Vitals

function saveData() {
  const data = {
    date: new Date().toLocaleDateString(),
    temperature: document.getElementById("temperature").value,
    bp: document.getElementById("bp").value,
    heartRate: document.getElementById("heartRate").value,
    oxygen: document.getElementById("oxygen").value,
    therapyNotes: document.getElementById("therapyNotes").value,
    medications: Array.from(document.querySelectorAll("#medicationsList div")).map(div => ({
      name: div.querySelector(".medName").value,
      dose: div.querySelector(".medDose").value,
      time: div.querySelector(".medTime").value
    }))
  };
  savedData.push(data);
  alert("Data saved!");
}

function sendWhatsApptemp() {
  
  //const phoneNumberCSA = "919176580847"; // Replace with actual number
  //const phoneNumberCSA ="917995470462";
  const message = "Test message from patient tracker";
  window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`);

}

/* function sendWhatsApp(){

  const phoneNumberCSA = "919176580847"; // Replace with actual number
  const phoneNumberJSA ="917995470462";

  const date = document.getElementById("dt").value;
  const morningVitals = {
    temp: document.getElementById("morning_temp").value,
    bp: document.getElementById("morning_bp").value,
    pr: document.getElementById("morning_pr").value,
    spo2: document.getElementById("morning_spo2").value,
  };
  const eveningVitals = {
    temp: document.getElementById("evening_temp").value,
    bp: document.getElementById("evening_bp").value,
    pr: document.getElementById("evening_pr").value,
    spo2: document.getElementById("evening_spo2").value,
  };
  const capping = {
    start: document.getElementById("capping_start").value,
    start_pr: document.getElementById("cap_start_pr").value,
    start_spo2: document.getElementById("cap_start_spo2").value,
    end: document.getElementById("capping_end").value,
    end_pr: document.getElementById("cap_end_pr").value,
    end_spo2: document.getElementById("cap_end_spo2").value,
  };
  const physio = document.getElementById("physio_notes").value;
  const swallow = document.getElementById("swallow_notes").value;
  const oralSuction = document.getElementById("oral_suctions").value;

  const inputQty = document.getElementById("inputQty").value;
  const outputQty = document.getElementById("outputQty").value;
  const motionPassed = document.getElementById("motionPassed").value;
  const tSecretions = document.getElementById("tSecretions").value;
  const rbs = document.getElementById("rbs").value;

  const meds = Array.from(document.querySelectorAll("#medicationsList div")).map(div => {
    const name = div.querySelector(".medName")?.value || "";
    const dose = div.querySelector(".medDose")?.value || "";
    const time = div.querySelector(".medTime")?.value || "";
    return `${name} (${dose}) @ ${time}`;
  }).join(", ");

  const message = `
_Date :- ${date}_

8 am vitals chart 
Bp:-${morningVitals.bp}
Pulse:-${morningVitals.pr}b/m
Spo2:-${morningVitals.spo2}%
Temp:-${morningVitals.temp}°f

8pm vitals chart 
Bp:-${eveningVitals.bp}
Pulse:-${eveningVitals.pr}b/m
Spo2:-${eveningVitals.spo2}%
Temp:-${eveningVitals.temp}°f

Capping Start Time- ${capping.start}
Capping End Time - ${capping.end} 

Notes :-
1. Suction /Secretions ( Trachea) : ${tSecretions} times
2. Oral Suctions : ${oralSuction} time(s)
3. Input - ${inputQty} ml Output - ${outputQty} ml
4. Motion Passed - ${motionPassed} times.
5. RBS - ${rbs} .
6. Physio Therapy - ${physio}
7. Swallow therapy - ${swallow} 
8. Medications given : 
\t ${meds}
`;

  const phoneNumber = "919176580847"; // Replace with actual number
  window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`);
}
*/

function sendWhatsApp() {
  // Collect vitals
  const date = document.getElementById("dt").value;
  const morningTemp = document.getElementById("morning_temp").value;
  const morningBP = document.getElementById("morning_bp").value;
  const morningPR = document.getElementById("morning_pr").value;
  const morningSpO2 = document.getElementById("morning_spo2").value;

  const eveningTemp = document.getElementById("evening_temp").value;
  const eveningBP = document.getElementById("evening_bp").value;
  const eveningPR = document.getElementById("evening_pr").value;
  const eveningSpO2 = document.getElementById("evening_spo2").value;

  const capStart = formatTimeToAMPM(document.getElementById("capping_start").value);
  const capStartPR = document.getElementById("cap_start_pr").value;
  const capStartSpO2 = document.getElementById("cap_start_spo2").value;
  const capEnd = formatTimeToAMPM(document.getElementById("capping_end").value);
  const capEndPR = document.getElementById("cap_end_pr").value;
  const capEndSpO2 = document.getElementById("cap_end_spo2").value;

  const inputQty = document.getElementById("inputQty").value;
  const outputQty = document.getElementById("outputQty").value;

  const motionPassed = document.getElementById("motionPassed").value;
  const tSecretions = document.getElementById("tSecretions").value;
  const oralSuction = document.getElementById("oral_suctions").value;
  const rbs = document.getElementById("rbs").value;

  const physioNotes = document.getElementById("physio_notes").value;
  const swallowNotes = document.getElementById("swallow_notes").value;

  // Collect checked medications
  const meds = Array.from(document.querySelectorAll('input[name="meds"]:checked'))
                    .map(cb => cb.value);


  //Validate the Form 

  const form = document.getElementById("trackerForm");

  if (!form.checkValidity()) {
    alert("Please fill all required fields correctly before sending.");
    form.reportValidity(); // highlights the missing fields
    return;
  }
  // Build WhatsApp message
  let message = `_Date: ${date}_\n\n`;

  message += `Morning Vitals (8:00 AM):\n`;
  message += `Temp: ${morningTemp}°f, \n BP: ${morningBP} mm Hg, \n PR: ${morningPR} bpm, \n SpO2: ${morningSpO2}%\n\n`;

  message += `Evening Vitals (8:00 PM):\n`;
  message += `Temp: ${eveningTemp}°f, \n BP: ${eveningBP} mm Hg, \n PR: ${eveningPR} bpm, \n SpO2: ${eveningSpO2}%\n\n`;

  message += `Capping Start Time: ${capStart} \n PR: ${capStartPR} bpm, \n SpO2: ${capStartSpO2}%\n\n`;
  message += `Capping End Time : ${capEnd} \n PR: ${capEndPR} bpm, \n SpO2: ${capEndSpO2}%\n\n`;

  message += `*Notes* : \n1. Input: ${inputQty} ml, Output: ${outputQty} ml`;
  message += `\n2. Motion Passed: ${motionPassed}, \n3. Trachea Secretion: ${tSecretions}, \n4. Oral Suction: ${oralSuction}, \n5.RBS: ${rbs}`;

  message += `\n6. Physio Therapy:\n${physioNotes}\n`;
  message += `\n7. Swallow Therapy:\n${swallowNotes}\n`;

  if (meds.length > 0) {
    message += `\n *Medications Given:*\n`;
    meds.forEach((med, i) => {
      message += `${i+1}. ${med}\n`;
    });
    message += `\n`;
  }

  // Encode and launch WhatsApp
  const encoded = encodeURIComponent(message);
  //window.open(`https://wa.me/?text=${encoded}`, "_blank");

  
  const phoneNumber = "919176580847"; // Replace with actual number
  window.open(`https://wa.me/${phoneNumber}?text=${encoded}`);
}


function exportToExcel() {
  alert("Excel export coming soon!");
}


//BP Validation Function
function validateBP(inputField) {
  const bpValue = inputField.value.trim();
  const pattern = /^\d{2,3}\/\d{2,3}$/;

  if (!pattern.test(bpValue)) {
    inputField.removeEventListener("blur", validateBPWrapper); // Temporarily disable blur
    inputField.value = "";
    alert("Please enter BP in format 120/80");
    inputField.focus();
    setTimeout(() => {
      inputField.addEventListener("blur", validateBPWrapper); // Re-enable blur after focus
    }, 500);
  }
}

function validateBPWrapper(event) {
  validateBP(event.target);
}

//PR Validation Function
function validatePR(inputField) {
  const prValue = inputField.value.trim();
  const pattern = /^\d{2,3}\/\d{2,3}$/;

  if (!pattern.test(prValue)) {
    inputField.removeEventListener("blur", validatePRWrapper); // Temporarily disable blur
    inputField.value = "";
    alert("Please enter PR in format 120/80");
    inputField.focus();
    setTimeout(() => {
      inputField.addEventListener("blur", validatePRWrapper); // Re-enable blur after focus
    }, 500);
  }
}

function validatePRWrapper(event) {
  validatePR(event.target);
}

function formatTimeToAMPM(timeStr) {
  if (!timeStr || !timeStr.includes(":")) return "Invalid time";

  const [hourStr, minuteStr] = timeStr.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (isNaN(hour) || isNaN(minute)) return "Invalid time";

  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  const formattedMinute = minute.toString().padStart(2, "0");

  return `${formattedHour}:${formattedMinute} ${ampm}`;
}

