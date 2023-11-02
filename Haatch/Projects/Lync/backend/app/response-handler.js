//functions to return error and success responses
exports.success_function = function(data)
{
    var response = {
        "status" : "success",
        "data" : data
    };
    return response;
}

exports.error_function = function(error)
{
    let status_code = 400;

    if(typeof(error)=='object')
    {
        status_code = error.data?.status? error.data.status : 400;
        error = error.data ? error.data : error;
    }
    
    var response = {
        "status" : "failed",
        "code" : status_code,
        "data" : error
    };
    return response;
}