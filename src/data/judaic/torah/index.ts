export default {
  info: {
    title: "Torah",
    description: "The central text of Judaism, comprising the first five books of the Hebrew Bible",
    type: "scripture",
    religion: "Judaism"
  },
  books: [
    {
      id: "genesis",
      title: "Genesis",
      transliteration: "Bereshit",
      description: "The first book of the Torah, dealing with creation and the patriarchs",
      chapters: [
        {
          number: 1,
          verses: [
            {
              number: 1,
              text: "In the beginning God created the heaven and the earth."
            },
            {
              number: 2,
              text: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters."
            }
          ]
        }
      ]
    },
    {
      id: "exodus",
      title: "Exodus",
      transliteration: "Shemot",
      description: "The second book of the Torah, dealing with the Israelites' exodus from Egypt",
      chapters: [
        {
          number: 1,
          verses: [
            {
              number: 1,
              text: "Now these are the names of the children of Israel, who came into Egypt with Jacob; every man came with his household:"
            },
            {
              number: 2,
              text: "Reuben, Simeon, Levi, and Judah;"
            },
            {
              number: 3,
              text: "Issachar, Zebulun, and Benjamin;"
            },
            {
              number: 4,
              text: "Dan and Naphtali, Gad and Asher."
            },
            {
              number: 5,
              text: "And all the souls that came out of the loins of Jacob were seventy souls; and Joseph was in Egypt already."
            }
          ]
        }
      ]
    }
  ]
};
