// read Excel file and convert to json format using fetch
fetch('excelFile/SegnaleticheTorino.xlsx').then(function (res) {
    /* get the data as a Blob */
    if (!res.ok) throw new Error("fetch failed");
    return res.arrayBuffer();
})
    .then(function (ab) {
        /* parse the data when it is received */
        var data = new Uint8Array(ab);
        var workbook = XLSX.read(data, {
            type: "array"
        });

        var first_sheet_name = workbook.SheetNames[0];
        /* Get worksheet */
        var worksheet = workbook.Sheets[first_sheet_name];

        var _JsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        /************************ End of conversion ************************/

        console.log(_JsonData);

        $.each(_JsonData, function (index, value) {

            console.log(value.name+" speed:"+value.maxspeed);
        });
    });