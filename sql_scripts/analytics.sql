/* moyenne des salaires et nombre d'offres par années d'expérience */
/* plus de 10 offres par année d'expérience pour éviter un échantillon peu représentatif */
SELECT experience, avg(salary), count(*)
FROM offers
WHERE salary IS NOT NULL
GROUP BY experience
HAVING count(*) > 10
ORDER BY experience;

/* moyenne des salaires et nombre d'offres par ville */
/* plus de 10 offres par ville pour éviter un échantillon peu représentatif */
SELECT city, avg(salary), count(*)
FROM offers
WHERE salary IS NOT NULL
GROUP BY city
HAVING count(*) > 10
ORDER BY avg(salary) DESC;

/* nombre d'offres enregistrées par mois et années */
SELECT YEAR(date), MONTH(date), count(*)
FROM offers
GROUP BY YEAR(date), MONTH(date)
ORDER BY YEAR(date), MONTH(date);

/* nombre d'offres enregistrées */
SELECT count(*)
FROM offers;

/* nombre d'annonces complètes (avec le salaire, l'experience requise et la société */
SELECT count(*)
FROM offers
WHERE salary IS NOT NULL
AND experience IS NOT NULL
AND society IS NOT NULL;

/* nombre d'annonces qui proposent un contrat en CDI */
SELECT count(*)
FROM offers
WHERE contract = "CDI ";
