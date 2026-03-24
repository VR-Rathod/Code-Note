import { Translation } from "./definition"

export default {
  propertyDefaults: {
    title: "शीर्षकहीन",
    description: "कोई विवरण नहीं",
  },
  components: {
    callout: {
      note: "नोट",
      abstract: "सारांश",
      info: "जानकारी",
      todo: "करना है",
      tip: "सुझाव",
      success: "सफलता",
      question: "प्रश्न",
      warning: "चेतावनी",
      failure: "विफलता",
      danger: "खतरा",
      bug: "बग",
      example: "उदाहरण",
      quote: "उद्धरण",
    },
    backlinks: {
      title: "बैकलिंक",
      noBacklinksFound: "कोई बैकलिंक नहीं मिला",
    },
    themeToggle: {
      lightMode: "लाइट मोड",
      darkMode: "डार्क मोड",
    },
    readerMode: {
      title: "रीडर मोड",
    },
    explorer: {
      title: "एक्सप्लोरर",
    },
    footer: {
      createdWith: "बनाया गया",
    },
    graph: {
      title: "ग्राफ व्यू",
    },
    recentNotes: {
      title: "हाल के नोट्स",
      seeRemainingMore: ({ remaining }) => `${remaining} और देखें →`,
    },
    transcludes: {
      transcludeOf: ({ targetSlug }) => `${targetSlug} का ट्रांसक्लूड`,
      linkToOriginal: "मूल से लिंक",
    },
    search: {
      title: "खोज",
      searchBarPlaceholder: "कुछ खोजें",
    },
    tableOfContents: {
      title: "विषय सूची",
    },
    contentMeta: {
      readingTime: ({ minutes }) => `${minutes} मिनट पढ़ने का समय`,
    },
  },
  pages: {
    rss: {
      recentNotes: "हाल के नोट्स",
      lastFewNotes: ({ count }) => `अंतिम ${count} नोट्स`,
    },
    error: {
      title: "नोट उपलब्ध नहीं",
      notFound: "यह नोट अभी उपलब्ध नहीं है। जल्द ही यहाँ सामग्री जोड़ी जाएगी।",
      home: "मुखपृष्ठ पर वापस जाएं",
    },
    folderContent: {
      folder: "फ़ोल्डर",
      itemsUnderFolder: ({ count }) =>
        count === 1 ? "इस फ़ोल्डर में 1 आइटम।" : `इस फ़ोल्डर में ${count} आइटम।`,
    },
    tagContent: {
      tag: "टैग",
      tagIndex: "टैग सूची",
      itemsUnderTag: ({ count }) =>
        count === 1 ? "इस टैग के साथ 1 आइटम।" : `इस टैग के साथ ${count} आइटम।`,
      showingFirst: ({ count }) => `पहले ${count} टैग दिखाए जा रहे हैं।`,
      totalTags: ({ count }) => `कुल ${count} टैग मिले।`,
    },
  },
} as const satisfies Translation
