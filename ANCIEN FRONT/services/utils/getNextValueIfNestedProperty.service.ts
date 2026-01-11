export const getNextValueIfNestedProperty = (properties: string, object : any) => {
    const regexp = /\./;

    if(!regexp.test(properties)){
        return object[properties]
    }
    else{
        const fields = properties.split(".");

        let result = object;

        fields.forEach(field => {
            // Accéder à la propriété suivante en suivant le chemin des fields
            result = result ? result[field] : undefined;

            // Si à un moment donné la propriété est undefined, on arrête l'itération
            if (result === undefined) {
                return;
            }
        });

        return result
    }
}