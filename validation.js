document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const requiredFields = Array.from(form.querySelectorAll("[required]"));

  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    telefono: /^\+?[\d\s().-]{7,20}$/
  };

  function getFieldLabel(field) {
    const label = form.querySelector('label[for="' + field.id + '"]');
    if (!label) return "Este campo";
    return label.textContent.replace("*", "").trim();
  }

  function ensureErrorNode(field) {
    const errorId = field.id + "-error";
    let node = document.getElementById(errorId);

    if (!node) {
      node = document.createElement("p");
      node.id = errorId;
      node.className = "mt-1.5 text-sm font-semibold text-red-700";
      node.setAttribute("role", "alert");
      node.hidden = true;
      field.insertAdjacentElement("afterend", node);
    }

    return node;
  }

  function attachDescribedBy(field, errorId) {
    const current = (field.getAttribute("aria-describedby") || "").trim();
    if (!current) {
      field.setAttribute("aria-describedby", errorId);
      return;
    }

    const parts = current.split(/\s+/);
    if (!parts.includes(errorId)) {
      parts.push(errorId);
      field.setAttribute("aria-describedby", parts.join(" "));
    }
  }

  function detachDescribedBy(field, errorId) {
    const current = (field.getAttribute("aria-describedby") || "").trim();
    if (!current) return;

    const parts = current.split(/\s+/).filter(function (part) {
      return part !== errorId;
    });

    if (parts.length === 0) {
      field.removeAttribute("aria-describedby");
    } else {
      field.setAttribute("aria-describedby", parts.join(" "));
    }
  }

  function setError(field, message) {
    const errorNode = ensureErrorNode(field);
    errorNode.textContent = message;
    errorNode.hidden = false;

    field.setAttribute("aria-invalid", "true");
    attachDescribedBy(field, errorNode.id);

    field.classList.add("border-red-500", "ring-red-200");
  }

  function clearError(field) {
    const errorNode = document.getElementById(field.id + "-error");
    if (errorNode) {
      errorNode.hidden = true;
      errorNode.textContent = "";
      detachDescribedBy(field, errorNode.id);
    }

    field.removeAttribute("aria-invalid");
    field.classList.remove("border-red-500", "ring-red-200");
  }

  function isEmpty(field) {
    if (field.type === "checkbox") return !field.checked;
    return field.value.trim() === "";
  }

  function validateField(field) {
    const label = getFieldLabel(field);
    const value = field.value.trim();

    clearError(field);

    if (field.required && isEmpty(field)) {
      setError(field, label + " es obligatorio.");
      return false;
    }

    if (field.id === "nombre" || field.id === "apellidos" || field.id === "cargo") {
      if (value.length < 2) {
        setError(field, label + " debe tener al menos 2 caracteres.");
        return false;
      }
    }

    if (field.id === "mensaje" && value.length < 20) {
      setError(field, "Mensaje y contexto del proyecto debe tener al menos 20 caracteres.");
      return false;
    }

    if (field.id === "email" && value !== "" && !patterns.email.test(value)) {
      setError(field, "Correo electronico no tiene un formato valido.");
      return false;
    }

    if (field.id === "telefono" && value !== "" && !patterns.telefono.test(value)) {
      setError(field, "Telefono debe tener un formato valido.");
      return false;
    }

    return true;
  }

  function validateForm() {
    let firstInvalid = null;
    let isValid = true;

    requiredFields.forEach(function (field) {
      const fieldValid = validateField(field);
      if (!fieldValid && !firstInvalid) {
        firstInvalid = field;
      }
      if (!fieldValid) {
        isValid = false;
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
    }

    return isValid;
  }

  requiredFields.forEach(function (field) {
    const eventName = field.tagName.toLowerCase() === "select" || field.type === "checkbox" ? "change" : "input";

    field.addEventListener(eventName, function () {
      validateField(field);
    });

    field.addEventListener("blur", function () {
      validateField(field);
    });
  });

  form.addEventListener("submit", function (event) {
    const isValid = validateForm();
    if (!isValid) {
      event.preventDefault();
    }
  });

  form.addEventListener("reset", function () {
    window.setTimeout(function () {
      requiredFields.forEach(clearError);
    }, 0);
  });
});
