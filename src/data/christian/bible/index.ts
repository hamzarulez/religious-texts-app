export default {
  info: {
    title: "The Holy Bible",
    description: "The sacred text of Christianity, containing the Old and New Testaments",
    type: "scripture",
    religion: "Christianity"
  },
  testaments: [
    {
      id: "new",
      title: "New Testament",
      description: "The second part of the Christian Bible, focusing on Jesus Christ's life and teachings",
      books: [
        {
          id: "matthew",
          title: "Matthew",
          chapters: [
            {
              number: 1,
              verses: [
                {
                  number: 1,
                  text: "The book of the genealogy of Jesus Christ, the son of David, the son of Abraham."
                },
                {
                  number: 2,
                  text: "Abraham was the father of Isaac, and Isaac the father of Jacob, and Jacob the father of Judah and his brothers"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "old",
      title: "Old Testament",
      description: "The first part of the Christian Bible, containing religious writings of ancient Israel",
      books: [
        {
          id: "genesis",
          title: "Genesis",
          chapters: [
            {
              number: 1,
              verses: [
                {
                  number: 1,
                  text: "In the beginning God created the heavens and the earth."
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};