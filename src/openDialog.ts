class __KT_OpenDialog {
    // file = () => { {
    //     return
    // }

    folder = (prompt?: string) => {
        return File.saveDialog(prompt || "Select a a file");
    };
}
