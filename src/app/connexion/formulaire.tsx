"use client";
import { useActionState } from "react";
import { connecterAction, type EtatConnexion } from "./actions";
const etatInitial: EtatConnexion = {};
export default function FormulaireConnexion() {
  const [etat, action, enCours] = useActionState(connecterAction, etatInitial);
  return (
    <form action={action} className="space-y-4" noValidate>
      <div>
        <label htmlFor="email" className="block text-sm font-bold text-encre">Adresse e-mail</label>
        <input id="email" name="email" type="email" required autoComplete="username" className="mt-1 w-full rounded-md border-2 border-trait px-3 py-2" placeholder="prenom.nom@exemple.bj" />
      </div>
      <div>
        <label htmlFor="motDePasse" className="block text-sm font-bold text-encre">Mot de passe</label>
        <input id="motDePasse" name="motDePasse" type="password" required autoComplete="current-password" className="mt-1 w-full rounded-md border-2 border-trait px-3 py-2" />
      </div>
      {etat.erreur && <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-rouge">{etat.erreur}</p>}
      <button type="submit" disabled={enCours} className="w-full rounded-md border-2 border-encre bg-jaune px-4 py-2 font-bold text-encre disabled:opacity-60">
        {enCours ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}
