import React, { useMemo, useState } from "react";

const DEFAULT_FORM = {
  name: "",
  phone: "",
  email: "",
  password: "",
  zone: "",
  vehicleType: "MOTORCYCLE",
};

function normalizePhone(phone) {
  return phone.replace(/\s+/g, "").trim();
}

function isValidSenegalPhone(phone) {
  const p = normalizePhone(phone);
  return /^(\+221)?7\d{8}$/.test(p);
}

function isValidEmail(email) {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function safeReadBody(res) {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json().catch(() => null);
  }
  return res.text().catch(() => "");
}

export default function AddCourierForm({ onSuccess }) {
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const dakarZoneGroups = useMemo(
    () => [
      {
        label: "Département de Dakar — Communes",
        options: [
          "Biscuiterie",
          "Cambérène",
          "Dakar-Plateau",
          "Dieuppeul-Derklé",
          "Fann-Point E-Amitié",
          "Grand Dakar",
          "Grand Yoff",
          "Gueule Tapée-Fass-Colobane",
          "Hann Bel-Air",
          "HLM",
          "Les Parcelles Assainies",
          "Médina",
          "Mermoz-Sacré-Cœur",
          "Ngor",
          "Ouakam",
          "Patte d'Oie",
          "Sicap-Liberté",
          "Yoff",
        ],
      },
      {
        label: "Département de Pikine — Communes",
        options: [
          "Dalifort",
          "Diamaguène Sicap Mbao",
          "Djidah Thiaroye Kaw",
          "Guinaw Rail Nord",
          "Guinaw Rail Sud",
          "Keur Massar",
          "Malika",
          "Mbao",
          "Pikine Est",
          "Pikine Nord",
          "Pikine Ouest",
          "Thiaroye Gare",
          "Thiaroye-sur-Mer",
          "Tivaouane Diacksao",
          "Yeumbeul Nord",
          "Yeumbeul Sud",
        ],
      },
      {
        label: "Département de Guédiawaye — Communes",
        options: [
          "Golf Sud",
          "Médina Gounass",
          "Ndiarème Limamoulaye",
          "Sam Notaire",
          "Wakhinane Nimzatt",
        ],
      },
      {
        label: "Département de Rufisque — Ville de Rufisque (3 communes)",
        options: ["Rufisque Est", "Rufisque Nord", "Rufisque Ouest"],
      },
      {
        label: "Département de Rufisque — Autres communes",
        options: ["Bargny", "Sébikotane", "Diamniadio", "Sangalkam", "Sendou"],
      },
    ],
    []
  );

  const allDakarZones = useMemo(() => {
    const flat = [];
    for (const g of dakarZoneGroups) {
      flat.push(...g.options);
    }
    return new Set(flat);
  }, [dakarZoneGroups]);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

  const handleChange = (key) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrorMsg("");
  };

  const validate = () => {
    const name = formData.name.trim();
    const phone = normalizePhone(formData.phone);
    const email = formData.email.trim();
    const password = formData.password;
    const zone = formData.zone;

    if (!API_BASE_URL)
      return "API_BASE_URL manquante. Configure REACT_APP_API_BASE_URL.";
    if (!name) return "Le nom est obligatoire.";
    if (!phone) return "Le téléphone est obligatoire.";
    if (!isValidSenegalPhone(phone))
      return "Téléphone invalide. Ex: +221771234567 ou 771234567.";
    if (!isValidEmail(email)) return "Email invalide.";
    if (!password || password.length < 8)
      return "Mot de passe trop court (minimum 8 caractères).";
    if (!zone) return "La zone est obligatoire.";
    if (!allDakarZones.has(zone))
      return "Zone invalide (choisis une zone dans la liste).";
    if (!["MOTORCYCLE", "BICYCLE", "CAR"].includes(formData.vehicleType))
      return "Type de véhicule invalide.";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (isSubmitting) return;

    const v = validate();
    if (v) {
      setErrorMsg(v);
      return;
    }

    setIsSubmitting(true);

    try {
      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem("diayal_admin_token")
          : null;

      if (!token) {
        setErrorMsg("Session admin expirée. Reconnecte-toi.");
        return;
      }

      const payload = {
        ...formData,
        name: formData.name.trim(),
        phone: normalizePhone(formData.phone),
        email: formData.email.trim() || undefined,
        region: "Dakar",
      };

      const res = await fetch(`${API_BASE_URL || ''}/api/admin/couriers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await safeReadBody(res);

      if (!res.ok) {
        const backendMsg =
          (data && typeof data === "object" && (data.message || data.error)) ||
          (typeof data === "string" ? data : "");
        setErrorMsg(
          backendMsg ||
            `Erreur (${res.status}). Vérifie tes droits admin ou les champs.`
        );
        return;
      }

      alert("Coursier ajouté avec succès ✅");
      setFormData(DEFAULT_FORM);
      if (onSuccess) onSuccess();
    } catch {
      setErrorMsg("Erreur de connexion. Vérifie le réseau / l'API.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-3 text-xs text-gray-500">
        Région: <span className="font-semibold">Dakar</span>
      </div>

      {errorMsg ? (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {errorMsg}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom complet</label>
          <input
            type="text"
            value={formData.name}
            onChange={handleChange("name")}
            placeholder="Ex: Mamadou Diop"
            className="w-full p-2 border rounded"
            required
            autoComplete="name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Téléphone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={handleChange("phone")}
            placeholder="Ex: +221771234567"
            className="w-full p-2 border rounded"
            required
            inputMode="tel"
          />
          <p className="mt-1 text-xs text-gray-500">
            Format recommandé: +221771234567 (ou 771234567)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Email (optionnel)
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={handleChange("email")}
            placeholder="Ex: mamadou@diayal.sn"
            className="w-full p-2 border rounded"
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mot de passe</label>
          <input
            type="password"
            value={formData.password}
            onChange={handleChange("password")}
            placeholder="Mot de passe temporaire (min 8 caractères)"
            className="w-full p-2 border rounded"
            required
            autoComplete="new-password"
          />
          <p className="mt-1 text-xs text-gray-500">
            Conseil: force le changement du mot de passe à la première connexion.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Zone d&apos;affectation (région de Dakar)
          </label>

          <select
            value={formData.zone}
            onChange={handleChange("zone")}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Choisir une zone</option>

            {dakarZoneGroups.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          <p className="mt-1 text-xs text-gray-500">
            Astuce: zone = commune. Les quartiers, c'est par livraison.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Type de véhicule
          </label>
          <select
            value={formData.vehicleType}
            onChange={handleChange("vehicleType")}
            className="w-full p-2 border rounded"
          >
            <option value="MOTORCYCLE">🏍️ Moto</option>
            <option value="BICYCLE">🚲 Vélo</option>
            <option value="CAR">🚗 Voiture</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full text-white p-2 rounded ${
            isSubmitting
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Ajout en cours..." : "Ajouter le coursier"}
        </button>
      </form>
    </div>
  );
}