const isEmpty= value => 

// console.log("Reached is-empty");

    value === undefined ||
    value === null ||
    (typeof(value) === 'object' && Object.keys(value).length === 0) ||
    (typeof(value) === 'string' && value.trim().length === 0);
    
    module.exports= isEmpty;