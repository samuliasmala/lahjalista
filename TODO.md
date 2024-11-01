### <IDEOITA>

// pages/login.tsx

# jos: sähköposti ei ole sääntöjen mukainen && salasanan pituus <= 0 -> Kirjaudu-buttonin className="cursor-not-allowed hover:text-white"

# Rekistöröidessä kun rekistöröidy-painike on painettu -> tee napista semmoinen ettei voi painaa uudelleen / tee jonkinlainen latausindikaattori jotta käyttäjä tietää, että jotain tapahtuu. Tämä "ongelma" näkyy parhaiten Vercelin tarjoamassa testiympäristössä, jossa nopeudet eivät ole localhostin kaltaiset

# Ehkä jonkinlainen kysymys, että haluaako pysyä kirjautuneena kun session on loppumassa? Kuten julkisissapalveluissa (Kela, OmaKanta, Suomi.fi yms)

### </IDEOITA>

TODO:

Laitetaan nappulat yms käyttämään tanstack-kirjastoa
https://www.npmjs.com/package/@tanstack/react-query

Korjaa DeleteModal.tsx ja EditModal.tsx:n "Toast-ongelma". Näyttää 2 Toastia, jos tulee 401 error (ei ole kirjautunut).

Korjausidea: Lisätään tarkistus oliko virhe 401.

Jos kyllä: ei laiteta Toastia.

Jos ei: laitetaan Toast
