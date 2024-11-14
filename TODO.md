### <IDEOITA>

// pages/login.tsx

# jos: sähköposti ei ole sääntöjen mukainen && salasanan pituus <= 0 -> Kirjaudu-buttonin className="cursor-not-allowed hover:text-white"

# Ehkä jonkinlainen kysymys, että haluaako pysyä kirjautuneena kun session on loppumassa? Kuten julkisissapalveluissa (Kela, OmaKanta, Suomi.fi yms)

# Jokin sivu (esimerkiksi asetuksiin), joka näyttää kaikki aktiiviset (miksei epäaktiiviset) Sessionit. Myöskin Sessionin poistomahdollisuus voitaisiin lisätä

# Enter-näppäimellä EditModalin ja DeleteModalin hyväksyminen

### </IDEOITA>

TODO:

Laitetaan nappulat yms käyttämään tanstack-kirjastoa. Ratkaisee samalla yhden ideoista
https://www.npmjs.com/package/@tanstack/react-query

Korjaa DeleteModal.tsx ja EditModal.tsx:n "Toast-ongelma". Näyttää 2 Toastia, jos tulee 401 error (ei ole kirjautunut).

Korjausidea: Lisätään tarkistus oliko virhe 401.

Jos kyllä: ei laiteta Toastia.

Jos ei: laitetaan Toast
