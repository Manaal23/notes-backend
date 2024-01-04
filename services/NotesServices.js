const Note = require("../Models/note");
const elasticsearch = require("../utils/elasticsearch");
const ValueSets = require("../utils/sets");

class notesServices {
  async getNotes(req, res) {
    try{

        const {userId} = req;
        let notes = await Note.find({ $or: [
            {
                userId: userId
            },
            {
                shared: {$in : [userId]}
            }
    
        ]  });
        return { error:false, data: notes };
    }catch(err){
        console.log(err, "getNotes")
    }
  }

  async saveNotes(req, res) {
    try {
      const { userId } = req;
      const { note, shared = [] } = req.body;

      if (!(note && note.trim().length))
        return {
            error: true,
            message: "something went wrong!",
          };

      let notes = await Note.create({ userId, note, shared });

      let elasticData = {
        id: notes._id,
        note: notes.note,
        shared,
        userId: notes.userId,
      };

      const elasticRes = await elasticsearch.addDocument("notes", elasticData);

      await Note.updateOne(
        {
          $and: [
            {
              _id: notes._id,
            },
            {
              userId,
            },
          ],
        },
        { $set: { elasticId: elasticRes._id } }
      );

      return {
        error: false,
        message: "saved",
      }
    } catch (err) {
      console.log(err, "save notes");
    }
  }

  async updateNotes(req, res) {
    try {
      const { userId } = req;
      const { id: noteId } = req.params;
      const { note, shared } = req.body;

      let notes = await Note.updateOne(
        {
          $and: [
            {
              _id: noteId,
            },
            {
              userId,
            },
          ],
        },
        { $set: { note, shared } }
      );

      let noteDetail = await Note.findOne({
        $and: [
          { _id: noteId },
          {
            userId,
          },
        ],
      });

      if (notes.modifiedCount) {
        //   elastic search update
        await elasticsearch.updateDocument("notes", {
          shared,
          note,
          elasticId: noteDetail.elasticId,
        });

        return{
            error: false,
            message: "saved",
          }
      } else
        return {
            error: true,
            message: "something went wrong!",
          }
    } catch (err) {
      console.log(err, "updateNotes");
    }
  }

  async notesDetail(req, res){
    try{

        const { userId } = req;
        const { id: noteId } = req.params;

        let noteDetail = await Note.findOne({
            $and: [
              { _id: noteId },
              {
                userId,
              },
            ],
          });
          if (!noteDetail)
          return{
            error: true,
            message: "No note found."
          }

          return {
            error: false,
            data: noteDetail
          }

    }catch(err){
        console.log(err, "error at notesDetail")
    }
  }

  async deleteNotes(req, res) {
    try {
      const { userId } = req;
      const { id: noteId } = req.params;

      let noteDetail = await Note.findOne({
        $and: [
          { _id: noteId },
          {
            userId,
          },
        ],
      });

      let notes = await Note.deleteOne({
        $and: [
          {
            _id: noteId,
          },
          {
            userId,
          },
        ],
      });

      if (notes.deletedCount){
        // Remove from elastic search
        await elasticsearch.deleteDocument("notes", noteDetail.elasticId)

          return {
            error: false,
            message: "deleted",
          }
      }
      else
        return{
            error: true,
            message: "something went wrong!",
          }
    } catch (err) {
      console.log(err, "deleteNotes");
    }
  }

  async shareNotes(req, res) {
    const { userId } = req;
    const { id: noteId } = req.params;
    const { shared } = req.body;

    let notes = await Note.updateOne(
      {
        $and: [
          {
            _id: noteId,
          },
          {
            userId,
          },
        ],
      },
      { $set: { shared } }
    );

    
    if (notes.modifiedCount){
        let noteDetail = await Note.findOne({
            $and: [
              { _id: noteId },
              {
                userId,
              },
            ],
          });
                //   elastic search update
                await elasticsearch.updateDocument("notes", {
                    shared,
                    elasticId: noteDetail.elasticId,
                  });

        return {
            error: false,
            message: "updated shared users",
          }
    }
    else
      return {
        error: true,
        message: "something went wrong!",
      }
  }

  async searchNotes(req, res) {
    const { userId } = req;

    let prefixData = await elasticsearch.prefixSearch(
      "notes",
      req.query.q,
      userId
    );

    let fuzzyData = await elasticsearch.fuzzySearch(
      "notes",
      req.query.q,
      userId
    );
    let prefixArray = new ValueSets();
    prefixData.hits.hits.map((val) => {
      if (
        userId === val._source.userId ||
        val._source.shared.includes(userId)
      ) {
        let data = {
          noteId: val._source.id,
          note: val._source.note,
        };
        prefixArray.add(data);
      }
    });
    fuzzyData.hits.hits.map((val) => {
      if (
        userId === val._source.userId ||
        val._source.shared.includes(userId)
      ) {
        let data = {
          noteId: val._source.id,
          note: val._source.note,
        };
        if (!prefixArray.has(data)) {
          prefixArray.add(data);
        }
      }
    });

    return {
        error: false,
      searches: [...prefixArray.values],
    }
  }
}

module.exports = new notesServices();
