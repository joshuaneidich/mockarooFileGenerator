$(document).ready(() => {
    //adding an event listener to demonstrate create text files from a csv, zipping up all the text files and then downloading
    document.getElementById("csv").addEventListener("change", convertCSV);

    async function convertCSV(e) {
        let csvFile = await e.target.files[0].text();
        let csvArray = $.csv.toObjects(csvFile);
        let fileProgressEl = document.getElementById("fileProgress");
        fileProgressEl.setAttribute("max", csvArray.length);
        let zip = new JSZip();
        console.time("File Generator")

        for (let i = 0; i < csvArray.length; i++) {
            //in this case we are given the filename as part of the mockaroo output
            let fileName = csvArray[i].filename;
            //the property in particular to set as the text file
            let fileText = csvArray[i].body;
            //create the file from the above choices
            zip.file(fileName, fileText);
            fileProgressEl.setAttribute("value", i);
            let filePercentage = Math.floor((i / csvArray.length) * 100);
            fileProgressEl.innerText = `${filePercentage}%`;
            console.log(i);
        }

        //create the zip file as a blob
        let zipFileToSave = await zip.generateAsync({
            type: "blob"
        });
        console.timeEnd("File Generator")
        //trigger a download
        saveAs(zipFileToSave, "download.zip");
    }
})