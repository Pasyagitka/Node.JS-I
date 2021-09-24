let fs = require('fs');

class Stat
{
    constructor(rootFolder)
    {
        this.rootFolder = rootFolder;
    }

    getFullFileName(relativeFileName)
    {
        return this.rootFolder + relativeFileName;
    }

    writeHTTP404 (response)
    {
        response.statusCode = 404;
        response.statusMessage = 'Resourse not found';
        response.end("HTTP ERROR 404: Resourse not found");
    }

    pipeFile(request, response, headers)
    {
        response.writeHead(200, headers);
        fs.createReadStream(this.getFullFileName(request.url)).pipe(response);
    }

    sendFile(request, response, headers)
    {
        console.log(this.getFullFileName(request.url));
        fs.access(this.getFullFileName(request.url), fs.constants.R_OK, err =>
        {
            if(err) this.writeHTTP404(response);
            else this.pipeFile(request, response, headers);
        });
    }
}
module.exports = (rootFolder) => {return new Stat(rootFolder);}