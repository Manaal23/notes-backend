const Note = require("../../Models/note");
const NotesServices = require("../../services/NotesServices");
const elasticsearch = require("../../utils/elasticsearch");
const ValueSets = require("../../utils/sets");

class notesController {

    async getNotes(req, res) {
        const response = await NotesServices.getNotes(req, res);
        res.status(response.error ? 400 : 201).send(response)
    }
    
    async saveNotes (req, res) {
        const response = await NotesServices.saveNotes(req, res);
        res.status(response.error ? 400 : 201).send(response)
    }

    async updateNotes (req, res) {
        const response = await NotesServices.updateNotes(req, res);
        res.status(response.error ? 400 : 201).send(response)
    }
    async notesDetail (req, res) {
        const response = await NotesServices.notesDetail(req, res);
        res.status(response.error ? 400 : 201).send(response)
    }
    async deleteNotes (req, res) {
        const response = await NotesServices.deleteNotes(req, res);
        res.status(response.error ? 400 : 201).send(response)
    }
    async shareNotes (req, res) {
        const response = await NotesServices.shareNotes(req, res);
        res.status(response.error ? 400 : 201).send(response)
    }
    async searchNotes (req, res) {
        const response = await NotesServices.searchNotes(req, res);
        res.status(response.error ? 400 : 201).send(response)
    }

//   async elasticData(req, res) {
//     res.send({
//       // data: await elasticsearch.updateDocument("notes", {
//       //     shared: [1,2],
//       //     note:"new note",
//       //     elasticId: "Xylw04wBLep5-epAMUjt"
//       // })
//     //   data: await elasticsearch.getDoc("notes","0im004wBLep5-epAgUjG"),
//     //   data: await elasticsearch.deleteDocument("notes","0im004wBLep5-epAgUjG"),
//     //   data: await elasticsearch.deleteAllIndices(),
//     });
//   }
}

module.exports = new notesController();
