let bookings = [];
let resource_request = null;
let slot_request = null;

function bookSlot() {
  const resource = document.getElementById("resource").value;
  const slot = document.getElementById("slot").value;
  resource_request = resource;
  slot_request = slot;

  const exists = bookings.find(
    (b) => b.resource_request === resource && b.slot_request === slot
  );

  if (exists) {
    alert("Slot already booked!");
    return;
  }

  const li = document.createElement("li");
  li.innerHTML = `
        ${resource} | ${slot}
        <button onclick="approve(this)">Approve</button>
        <button onclick="reject(this)">Reject</button>
    `;

  document.getElementById("requests").appendChild(li);

  alert("Booking request sent to admin");
}

function approve(btn) {
  alert("Booking Approved (Email/SMS Sent)");
  const request = { resource_request, slot_request };
  bookings.push(request);
  btn.parentElement.remove();
}

function reject(btn) {
  alert("Booking Rejected (Email/SMS Sent)");
  btn.parentElement.remove();
}

function addSlot() {
  const newRes = document.getElementById("newResource").value.trim();
  const newSlot = document.getElementById("newSlot").value.trim();

  if (!newRes || !newSlot) {
    alert("Please enter both Resource and Time Slot.");
    return;
  }

  const slotPattern = /^[0-9:\-\s]+$/;
  if (!slotPattern.test(newSlot)) {
    alert(
      "Time Slot must contain only numbers, colon (:), dash (-), and spaces (e.g., 9:00 - 10:00)."
    );
    return;
  }

  const selectRes = document.getElementById("resource");
  const optionRes = document.createElement("option");
  optionRes.text = newRes;
  selectRes.add(optionRes);

  const selectSlot = document.getElementById("slot");
  const optionSlot = document.createElement("option");
  optionSlot.text = newSlot;
  selectSlot.add(optionSlot);

  document.getElementById("newResource").value = "";
  document.getElementById("newSlot").value = "";

  alert(`Resource "${newRes}" and Time Slot "${newSlot}" added!`);
}
