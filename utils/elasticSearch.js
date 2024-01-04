const { Client } = require("@elastic/elasticsearch");

class elastic {
  constructor() {
    // this.client = new Client({
    //   node: "http://localhost:9200",
    //   maxRetries: 5,
    //   requestTimeout: 60000,
    //   // sniffOnStart: true
    // });
    this.client = new Client({
      cloud: {
        id: process.env.ELASTIC_CLOUD_ID,
      },
      auth: {
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD,
      },
    });
  }
  async initIndex(indexName) {
    await this.client.indices.create({
      index: indexName,
    });
  }
  async addDocument(indexName, data) {
    const res = await this.client.index({
      index: indexName,
      refresh: true,
      body: {
        ...data
      }
    });

    return res
  }

//   "id": "65966258ab5af5e7e970acde",
//             "note": "first note 123333 updated today 1 mmm",
//             "shared": [],
//             "userId": "65959502720f2ea3ef4ccf42"
  async updateDocument(indexName, data) {
    const res = await this.client.update({
      index: indexName,
      id: data.elasticId,
      doc: {
        shared: data.shared,
        note: data.note
      }
    });
    return res;
  }

  async deleteDocument(indexName, id){
    const res = await this.client.delete({
        index: indexName,
        id
      });

      return res;

  }

  prefixSearch(indexName, note, userId) {
    return new Promise((resolve) => {
      const prefixData = this.client.search({
        index: indexName,
        body: {
          query: {
            prefix: {
                note
             },
          },
        },
        size: 50,
      });
      resolve(prefixData);
    });
  }

  async fuzzySearch(indexName, note, userId) {
    return new Promise((resolve) => {
      const fuzzyData = this.client.search({
        index: indexName,
        body: {
          query: {
            fuzzy: {
                note: {
                value: note,
                fuzziness: 2,
                max_expansions: 1000,
              },
            },
          },
        },
        size: 50,
      });
      resolve(fuzzyData);
    });
  }
  async getDoc(indexName,docId){
    const res = await this.client.get({
        index: indexName,
        id: docId
      })
      return res;
  }
  async deleteAllIndices() {
    const res = await this.client.indices.delete(
      {
        index: "_all",
      },
      function (err, res) {
        if (err) {
          console.error(err.message);
        } else {
          console.log("Indexes have been deleted!");
        }
      }
    );

    return res;
  }
}

module.exports = new elastic();
