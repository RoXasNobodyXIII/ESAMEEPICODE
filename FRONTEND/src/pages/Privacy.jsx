import React from 'react';

const Privacy = () => {
  React.useEffect(() => {
    document.title = "Privacy";
  }, []);

  return (
    <div className="container mt-5">
      <h1>Privacy Policy</h1>
      <p>
        CROCE D'ORO SUD PONTINO ONLUS – Organizzazione di Volontariato di primo soccorso e assistenza sanitaria –
        (di seguito anche "Titolare del trattamento"), come previsto dal Regolamento dell’Unione Europea n. 679/2016
        (RGPD) e dalla normativa nazionale vigente in materia di privacy, fornisce le seguenti informazioni sulle
        modalità di raccolta e utilizzazione dei dati personali.
      </p>

      <h2 className="h4 mt-4">Chi è il Titolare del trattamento</h2>
      <p>
        Titolare del trattamento dei dati personali è la CROCE D'ORO SUD PONTINO ONLUS, con sede in Via Roma, 60 – 04029 Sperlonga (LT).
        E-mail: <a href="mailto:crocedorosudpontino@virgilio.it">crocedorosudpontino@virgilio.it</a>
      </p>

      <h2 className="h4 mt-4">Quali dati verranno raccolti</h2>
      <p>
        Verranno raccolti direttamente dall’interessato o acquisiti da terzi (es. familiari, tutori) dati personali
        anagrafici (nome, cognome, ecc.) e di contatto (telefono, e-mail, ecc.), nonché informazioni relative allo stato
        di salute (dati appartenenti a categorie particolari ex art. 9 RGPD) per la gestione del servizio di pronto
        intervento sanitario o di trasporto privato richiesto, nelle sue diverse articolazioni organizzative. Per il
        servizio di trasporto privato verranno altresì acquisiti i dati necessari per finalità amministrative,
        civilistiche e tributarie.
      </p>

      <h2 className="h4 mt-4">Per quali scopi vengono trattati i dati</h2>
      <p>
        I dati personali sono trattati per la gestione delle chiamate in entrata, per dare evidenza delle attività svolte
        ed erogare il servizio di pronto intervento sanitario o di trasporto privato. I dati richiesti sono limitati a
        quelli indispensabili per l’instaurazione e gestione del rapporto. Il trattamento avviene nel rispetto del
        principio di minimizzazione.
      </p>

      <h2 className="h4 mt-4">Base giuridica del trattamento</h2>
      <ul>
        <li>
          Emergenza 118: Art. 6 lett. d) RGPD (salvaguardia degli interessi vitali) e Art. 9, comma 2 RGPD lett. c), g), h).
        </li>
        <li>
          Trasporto privato: Art. 6, comma 1, lett. b) RGPD (esecuzione di un contratto o misure precontrattuali),
          Art. 6 lett. c) RGPD (obbligo legale), Art. 6 lett. f) RGPD (legittimo interesse).
        </li>
      </ul>

      <h2 className="h4 mt-4">Natura obbligatoria o facoltativa del conferimento</h2>
      <p>
        Il mancato conferimento dei dati personali necessari comporta l’impossibilità di gestire correttamente il
        rapporto con l’Utente e di eseguire la prestazione di soccorso o di trasporto.
      </p>

      <h2 className="h4 mt-4">Modalità del trattamento</h2>
      <p>
        Il trattamento avviene su supporto cartaceo e digitale, da parte di soggetti autorizzati e istruiti, nel rispetto
        delle misure tecniche e organizzative adeguate a garantire sicurezza, riservatezza, integrità e disponibilità dei
        dati. Non è previsto alcun processo decisionale automatizzato.
      </p>

      <h2 className="h4 mt-4">Soggetti che possono venire a conoscenza dei dati</h2>
      <p>
        Per le finalità sopra indicate, i dati personali potranno essere resi accessibili a:
      </p>
      <ul>
        <li>Dipendenti, collaboratori e associati del Titolare, in qualità di soggetti autorizzati;</li>
        <li>Servizi di continuità assistenziale della ASL e strutture sanitarie;</li>
        <li>Forze dell’Ordine e soggetti legittimati all’accesso;</li>
        <li>
          In caso di trasporto privato: personale amministrativo e soggetti terzi che svolgono adempimenti previsti da
          obblighi di legge (es. consulenti contabili, fiscali, legali; soggetti, enti o Autorità a cui la comunicazione è
          obbligatoria per legge o regolamento).
        </li>
      </ul>
      <p>
        I dati non saranno diffusi né trasferiti verso Paesi terzi od Organizzazioni Internazionali, salvo obblighi di
        legge.
      </p>

      <h2 className="h4 mt-4">Tempi di conservazione</h2>
      <ul>
        <li>Dati relativi al servizio 118: conservazione illimitata per obbligo normativo.</li>
        <li>
          Dati del trasporto privato per finalità amministrative/civilistiche/tributarie: fino a 10 anni dalla conclusione
          del rapporto.
        </li>
      </ul>

      <h2 className="h4 mt-4">Diritti dell’interessato</h2>
      <p>
        L’interessato può, in qualsiasi momento, esercitare i diritti previsti dal RGPD: accesso, copia, informazioni sul
        trattamento, aggiornamento e rettifica, integrazione, cancellazione/limitazione nei casi previsti, opposizione,
        portabilità ove applicabile. Resta salva la possibilità di proporre reclamo al Garante per la Protezione dei Dati
        Personali secondo le procedure previste.
      </p>
      <p>
        Modello diritti interessati: <a href="https://www.garanteprivacy.it/en/home/docweb/-/docweb-display/docweb/1089924" target="_blank" rel="noopener noreferrer">link al modulo</a>.
      </p>

      <h2 className="h4 mt-4">Come esercitare i diritti</h2>
      <p>
        Per esercitare i diritti sopra elencati è possibile scrivere al Titolare del trattamento indicando l’oggetto della
        richiesta e il diritto che si intende esercitare, allegando copia di un documento di identità. La richiesta può
        essere inviata via e-mail all’indirizzo: <a href="mailto:crocedorosudpontino@virgilio.it">crocedorosudpontino@virgilio.it</a>.
      </p>
    </div>
  );
};

export default Privacy;
