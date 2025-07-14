import { useEffect, useState } from "react";
import "../../styles/Delivery.css";
import { useNavigate } from "react-router-dom";
import AutoLogin from "../AutoLogin";

// Step labels for the multi-step progress bar
const steps = [
  { id: 1, label: "Osobní údaje" },        // Personal Information
  { id: 2, label: "Adresa doručení" },     // Delivery Address
  { id: 3, label: "Poznámka" },            // Note
];

const Delivery = () => {
  const navigate = useNavigate();

  // State to keep track of current step in the form
  const [step, setStep] = useState(1);

  // State object holding the form fields' values
  const [userInfo, setUserInfo] = useState({
    fName: "",
    lName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    psc: "",
    note: "",
  });

  // State for form validation errors keyed by field names
  const [errors, setErrors] = useState({});

  // State to track loading status during form submission
  const [isLoading, setIsLoading] = useState(false);

  // Updates userInfo state when a form input changes, clears error for that field
  const handleChange = (field, value) => {
    setUserInfo({ ...userInfo, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null }); // Clear error on change
    }
  };

  // Validates inputs depending on the current step, sets errors state accordingly
  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      // Validation for Personal Information step
      if (!userInfo.fName) newErrors.fName = "Jméno je povinné";               // First name required
      if (!userInfo.lName) newErrors.lName = "Příjmení je povinné";           // Last name required
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) newErrors.email = "Neplatný e-mail";  // Email format check
      if (!/^[+\d\s]{9,}$/.test(userInfo.phone)) newErrors.phone = "Neplatné číslo";                // Phone number format
    } else if (step === 2) {
      // Validation for Delivery Address step
      if (!userInfo.street) newErrors.street = "Ulice je povinná";             // Street required
      if (!userInfo.city) newErrors.city = "Město je povinné";                 // City required
      if (!/^\d{3}\s?\d{2}$/.test(userInfo.psc)) newErrors.psc = "Neplatné PSČ";  // Postal code format (Czech style)
    }

    // Update errors state
    setErrors(newErrors);

    // Return true if no errors, false otherwise
    return Object.keys(newErrors).length === 0;
  };

  // Moves to the next form step if validation passes
  const nextStep = () => {
    if (validateStep()) {
      setStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  // Moves back to the previous form step
  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  // Sends user information to backend to save it
  const saveUserData = async (userInfo) => {
    const token = localStorage.getItem("token"); // Get auth token

    const res = await fetch("http://localhost:5000/saveUserInfo", {
      method: "POST",
      credentials: "include",  // Include cookies for auth
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Bearer token authorization
      },
      body: JSON.stringify({ userInfo }),
    });

    if (!res.ok) {
      throw new Error("Failed to save user data");
    }

    return await res.json();
  };

  // Fetches user info from backend (e.g. for pre-filling form if logged in)
  const getClientInformation = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:5000/getUserInfo", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Chyba při načítání dat: ${res.statusText}`);
      }

      const data = await res.json();

      // Populate form fields with fetched data
      setUserInfo(data.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // Handles final form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep()) {
      setIsLoading(true); // Show loading indicator

      try {
        await saveUserData(userInfo);
        navigate("/prehled"); // Redirect to summary page after successful save
      } catch (err) {
        console.error("Nastala chyba při ukládání:", err);
      } finally {
        setIsLoading(false); // Hide loading indicator
      }
    }
  };

  // On component mount, check if user is logged in and fetch their info
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Nejste přihlášený. Přihlaste se prosím."); // Alert if not logged in
      navigate("/login"); // Redirect to login page
      return;
    }

    getClientInformation();
  }, []);

  return (
    <>
      {/* Auto-login component to handle session management */}
      <AutoLogin />

      <section className="delivery-section">
        {/* Progress bar showing the steps */}
        <div className="progress-bar">
          {steps.map(({ id, label }) => (
            <div
              key={id}
              className={`progress-step ${
                id === step ? "active" : id < step ? "completed" : ""
              }`}
              onClick={() => setStep(id)} // Allow clicking on steps to navigate
            >
              {label}
            </div>
          ))}
        </div>

        {/* Multi-step form */}
        <form className="delivery-form" onSubmit={handleSubmit}>
          <div className="form-steps">
            {/* Step 1: Personal Information */}
            <div className={`form-step ${step === 1 ? "active" : step < 1 ? "prev" : "next"}`}>
              <div className="form-group">
                <label className="form-label">Křestní jméno</label>
                <input
                  type="text"
                  value={userInfo.fName}
                  onChange={(e) => handleChange("fName", e.target.value)}
                  className={errors.fName ? "input-error" : ""}
                  autoComplete="given-name"
                />
                {errors.fName && <small className="error-text">{errors.fName}</small>}
              </div>
              <div className="form-group">
                <label className="form-label">Příjmení</label>
                <input
                  type="text"
                  value={userInfo.lName}
                  onChange={(e) => handleChange("lName", e.target.value)}
                  className={errors.lName ? "input-error" : ""}
                  autoComplete="family-name"
                />
                {errors.lName && <small className="error-text">{errors.lName}</small>}
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={userInfo.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={errors.email ? "input-error" : ""}
                  autoComplete="email"
                />
                {errors.email && <small className="error-text">{errors.email}</small>}
              </div>
              <div className="form-group">
                <label className="form-label">Telefon</label>
                <input
                  type="tel"
                  value={userInfo.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className={errors.phone ? "input-error" : ""}
                  autoComplete="tel"
                />
                {errors.phone && <small className="error-text">{errors.phone}</small>}
              </div>
            </div>

            {/* Step 2: Delivery Address */}
            <div className={`form-step ${step === 2 ? "active" : step < 2 ? "prev" : "next"}`}>
              <div className="form-group">
                <label className="form-label">Město</label>
                <input
                  type="text"
                  value={userInfo.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className={errors.city ? "input-error" : ""}
                  autoComplete="address-level2"
                />
                {errors.city && <small className="error-text">{errors.city}</small>}
              </div>

              <div className="form-group">
                <label className="form-label">Ulice</label>
                <input
                  type="text"
                  value={userInfo.street}
                  onChange={(e) => handleChange("street", e.target.value)}
                  className={errors.street ? "input-error" : ""}
                  autoComplete="address-line1"
                />
                {errors.street && <small className="error-text">{errors.street}</small>}
              </div>
              <div className="form-group">
                <label className="form-label">PSČ</label>
                <input
                  type="text"
                  value={userInfo.psc}
                  onChange={(e) => handleChange("psc", e.target.value)}
                  className={errors.psc ? "input-error" : ""}
                  autoComplete="postal-code"
                />
                {errors.psc && <small className="error-text">{errors.psc}</small>}
              </div>
              <div>
                <p>Vaše zasilka bude doručena do 2–5 dnů.</p>
              </div>
            </div>

            {/* Step 3: Additional Note */}
            <div className={`form-step ${step === 3 ? "active" : step < 3 ? "prev" : "next"}`}>
              <div className="form-group form-group--full">
                <label className="form-label">Poznámka</label>
                <textarea
                  value={userInfo.note}
                  onChange={(e) => handleChange("note", e.target.value)}
                  placeholder="Zde můžeš napsat cokoli navíc..."
                  rows={5}
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          {/* Navigation buttons for form steps */}
          <div className="buttons-row">
            {/* Back button shown on steps after the first */}
            {step > 1 && (
              <button type="button" className="form-button back" onClick={prevStep}>
                Zpět
              </button>
            )}
            {/* Next button shown on steps before the last */}
            {step < steps.length && (
              <button type="button" className="form-button" onClick={nextStep}>
                Další
              </button>
            )}
            {/* Submit button shown on the last step */}
            {step === steps.length && (
              <button type="submit" className="form-button" disabled={isLoading}>
                {isLoading ? "Odesílám..." : "Odeslat"}
              </button>
            )}
          </div>
        </form>
      </section>
    </>
  );
};

export default Delivery;
