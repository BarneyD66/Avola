import type { Messages } from "@/locales";

export const en: Messages = {
  header: {
    homeAriaLabel: "Avola home",
    track: "Track Order",
    login: "Login",
  },
  locale: {
    zh: "中文",
    en: "English",
  },
  theme: {
    dark: "Dark",
    light: "Light",
  },
  home: {
    intro: {
      eyebrow: "Avola",
      title: "Turn every growth budget into real user participation",
      description:
        "Unlike platforms that only provide KOL posting and traffic exposure, we focus more on real participation, actual conversion, and trackable growth results.",
      note: "This platform only provides real user participation services, with direct ordering and order tracking supported.",
    },
    notice: {
      title: "Service Notes",
      paragraphs: [
        "Please confirm your service needs and related requirements before placing an order.",
        "Orders are not refundable after payment. Please confirm everything is correct before ordering.",
        "Only Crypto payment is currently supported.",
      ],
      supportLabel: "Support:",
      supportHandle: "@Avolaofficial",
      rules: [
        "All services are carried out through real user participation.",
        "After ordering, progress can be tracked in real time through the order number and query password.",
        "Please keep your query information properly to avoid information leakage.",
        "Disclaimer: The products on this site are for learning and testing purposes only. Do not use them for illegal activities. Once discovered, you bear the consequences yourself.",
      ],
    },
    categories: {
      title: "Service Categories",
      description: "Quickly choose the type of growth service you need",
      packagePreview: "Package Preview",
      selectService: "Select Service",
      viewServiceDetails: "View Service Details",
    },
  },
  service: {
    detailEyebrow: "Service Detail",
    introTitle: "Service Introduction",
    scenariosTitle: "Applicable Scenarios",
    deliveryTitle: "Delivery Information",
    notesTitle: "Notes",
    startingPrice: "Starting price: {value}",
    estimatedDelivery: "Estimated delivery time: {value}",
    executionMode: "Execution method: real user participation",
    purchaseMode: "Ordering method: no login required",
    orderRequest: "Order Request",
    buyNow: "Buy Now",
    noLoginDescription:
      "No registration is required. Submit the order request after filling in the information.",
    selectPackage: "Select Package",
    currentPackage: "Current Package",
    price: "Price",
    deliveryTime: "Estimated delivery time",
    estimatedPrefix: "Estimated",
    recommended: "Recommended",
    contact: "Contact Method",
    contactPlaceholder: "Email / X / Other contact method (optional)",
    extraRequirements: "Additional Requirements (Optional)",
    extraRequirementsPlaceholder:
      "Please provide any additional task requirements in English",
    queryPassword: "Query Password",
    queryPasswordPlaceholder: "Please set a query password",
    selectPlaceholder: "Please select",
    validations: {
      required: "Please fill in this field",
      url: "Please enter a valid URL",
      number: "Please enter numbers only",
      package: "Please select one package",
    },
    packageLabels: {
      starter: "Starter Package",
      growth: "Growth Package",
      scale: "Scale Package",
    },
  },
  track: {
    pageEyebrow: "Order Tracking",
    title: "Track Order",
    description:
      "Enter the order number and query password to view the current progress and latest status.",
    loading: "Loading order tracking information.",
    formEyebrow: "Lookup",
    formTitle: "Track Order",
    formDescription:
      "Fill in the order number and query password to view the current progress and latest status.",
    orderId: "Order ID",
    orderIdPlaceholder: "Please enter the order ID",
    password: "Query Password",
    passwordPlaceholder: "Please enter the query password",
    submit: "Track Order",
    errors: {
      orderId: "Please enter the order ID",
      password: "Please enter the query password",
      notFound: "Order not found or query information is incorrect",
    },
    context: {
      created: "You are currently viewing the order you just created. Progress will continue to update.",
      dashboard: "You are currently viewing the real-time progress of a historical order.",
      clear: "Clear",
    },
    resultEyebrow: "Order Result",
    currentProgress: "Current progress {value}%",
    saveInfoHint: "Please keep your order information properly for later progress tracking.",
    currentStatus: "Current Status",
    progressOverview: "Progress Overview",
    progressDescription:
      "Progress will continue to update as the order advances. It is recommended to confirm the latest status by the most recent update time.",
    timelineTitle: "Timeline",
    timelineDescription:
      "The order status will advance by milestones, so you can keep track of the current stage.",
    paymentStatus: "Payment Status",
    paymentStatusDescription: "Payment and execution status are displayed separately for easier tracking.",
  },
  order: {
    labels: {
      orderId: "Order ID",
      serviceName: "Service Name",
      createdAt: "Created At",
      updatedAt: "Last Updated",
      estimatedCompletion: "Estimated Completion",
      amount: "Amount",
      packagePrice: "Package Price",
      packageResult: "Package Result",
      selectedPackage: "Selected Package",
      queryPassword: "Query Password",
      progress: "Progress",
      basicInfo: "Basic Information",
      orderSummary: "Order Summary",
      timeline: "Timeline",
      paymentStatus: "Payment Status",
      paymentMethod: "Payment Method",
      paymentProvider: "Payment Provider",
      paymentAmount: "Payment Amount",
      paymentCurrency: "Payment Currency",
      paymentChain: "Payment Chain",
      paymentAddress: "Payment Address",
      paymentReference: "Payment Reference",
      paymentExpiresAt: "Payment Expires At",
      paidAt: "Paid At",
    },
    status: {
      pending: {
        label: "Pending",
        description: "The order has been received and is waiting to enter the execution process.",
        summary:
          "The current order has entered the pending stage. The system will update the execution progress after scheduling is completed.",
      },
      running: {
        label: "Running",
        description: "The current order is being processed. Please check again later for the latest progress.",
        summary:
          "The current order is being processed. Please check again later for the latest progress.",
      },
      reviewing: {
        label: "Running",
        description: "The current order is being processed. Please check again later for the latest progress.",
        summary:
          "The current order is being processed. Please check again later for the latest progress.",
      },
      completed: {
        label: "Completed",
        description: "The current order has been delivered.",
        summary:
          "The current order has been delivered. You can continue arranging new service requests according to the current pace.",
      },
      issue: {
        label: "Issue Handling",
        description: "There is an issue with the current order and it is being handled.",
        summary:
          "There is an issue with the current order. The system is handling it and evaluating the follow-up progress rhythm.",
      },
    },
    timelineLabels: {
      created: "Order created",
      queued: "Entered execution queue",
      running: "Running",
      reviewing: "Running",
      completed: "Completed",
      pending: "Pending update",
    },
    copy: {
      show: "Show",
      hide: "Hide",
      copy: "Copy",
      copied: "Copied",
    },
  },
  payment: {
    provider: "Unipay",
    method: "Crypto",
    status: {
      pending_payment: {
        label: "Pending Payment",
        description: "The order has been created. Please complete payment first before processing begins.",
      },
      awaiting_transfer: {
        label: "Awaiting Transfer",
        description: "Please complete the transfer according to the amount shown on this page.",
      },
      payment_confirming: {
        label: "Payment Confirming",
        description: "The system is confirming whether the payment has arrived. Please check again shortly.",
      },
      paid: {
        label: "Paid",
        description: "Payment has been completed and the order has entered the processing flow.",
      },
      payment_failed: {
        label: "Payment Failed",
        description: "The current payment did not complete successfully. Please start the payment again.",
      },
      expired: {
        label: "Expired",
        description: "The current payment session has expired. Please start a new payment.",
      },
      cancelled: {
        label: "Cancelled",
        description: "The current payment flow has been cancelled. You can start a new payment.",
      },
    },
  },
  checkout: {
    eyebrow: "Checkout",
    title: "Complete Payment",
    description:
      "Before entering the formal payment flow, please confirm the order information and current payment status.",
    missingTitle: "Order not found",
    missingDescription:
      "No payable order information is currently available. Please return to the service page and submit a new order.",
    summaryTitle: "Payment Summary",
    instructionsTitle: "Payment Instructions",
    instructions: [
      "Please complete payment according to the amount shown on this page.",
      "After payment is confirmed, the system will automatically update the order status.",
      "If the page does not update automatically after payment, please check later on the order tracking page.",
    ],
    continuePayment: "Simulate Payment Success",
    continuePaymentHint:
      "This button is currently used for internal mock payment testing.",
    mockModeHint:
      "After simulated payment success, the order will enter the internal processing flow.",
    trackOrder: "Track Order",
    backHome: "Back to Home",
    packageTitle: "Selected Package",
  },
  success: {
    eyebrow: "Payment Success",
    title: "Payment Completed",
    description:
      "Payment has been completed and the order has entered the processing flow.",
    unpaidTitle: "Payment not completed",
    unpaidDescription:
      "The current order has not reached the paid state yet. Please return to the checkout page to continue the process.",
    mockNotice:
      "This order is currently in mock payment mode and has entered the internal processing flow.",
    trackOrder: "Track Order",
    home: "Back to Home",
    backToCheckout: "Back to Checkout",
  },
  created: {
    eyebrow: "Order Created",
    title: "Order request submitted",
    description:
      "Your order information has been generated. Please keep the order number and query password properly for later tracking.",
    loadingTitle: "Reading order information",
    loadingDescription:
      "Please wait while the demo order confirmation data in the current session is being loaded.",
    cardTitle: "Order Information",
    cardDescription:
      "This page shows demo order confirmation information, which can later be replaced with the formal order result receipt.",
    nextStepsTitle: "Next Steps",
    nextSteps: [
      'You can use the order number and query password on the "Track Order" page to follow progress.',
      "Please keep your query information properly to avoid information leakage.",
      "This page is currently a demo version. Formal payment and order systems will be connected later.",
    ],
    actions: {
      track: "Track Order",
      home: "Back to Home",
      repurchase: "Buy Another Service",
    },
    missing: {
      eyebrow: "Missing Order",
      title: "Order information not found",
      description:
        "No order confirmation data is currently available on this page. Please return to the service page and submit again.",
      home: "Back to Home",
      track: "Go to Track Order",
    },
  },
  dashboard: {
    pageTitles: {
      default: "User Dashboard",
      overview: "Overview",
      orders: "My Orders",
      detail: "Order Detail",
    },
    headerEyebrow: "Dashboard",
    demoUser: "Demo User",
    logout: "Logout",
    sidebarDescription:
      "Manage order progress, view history, and quickly enter frequently used services.",
    accountSettings: "Account Settings",
    upcoming: "Available in a later version",
    overview: {
      eyebrow: "User Dashboard",
      title: "User Dashboard",
      description:
        "View order progress, manage historical records, and quickly launch new service requests",
      stats: {
        totalOrders: {
          label: "Total Orders",
          description: "Total number of orders created under the current account",
        },
        runningOrders: {
          label: "Active Orders",
          description: "Including pending and running orders",
        },
        completedOrders: {
          label: "Completed Orders",
          description: "Orders that have been delivered and entered the wrap-up stage",
        },
        totalSpend: {
          label: "Total Spend",
          description: "Currently demo data. Real billing statistics can be connected later.",
        },
      },
      recentOrdersTitle: "Recent Orders",
      recentOrdersDescription:
        "Focus on the orders that are moving recently and quickly enter the detail page to view the latest status.",
      allOrders: "View All Orders",
      latestUpdatedAt: "Last Updated",
      paymentStatusLabel: "Payment",
      quickReorderTitle: "Quick Reorder",
      quickReorderDescription:
        "You can directly re-enter the order page for frequently used services and reduce repeated path searching.",
      reorderItems: [
        "Buy Twitter follower growth again",
        "Buy Verified comments again",
        "Buy GitHub stars again",
      ],
    },
    orders: {
      eyebrow: "Orders",
      title: "My Orders",
      description: "View the current status and historical records of all orders",
      filters: {
        all: "All",
        running: "Running",
        reviewing: "Running",
        completed: "Completed",
        issue: "Issue Handling",
      },
      table: {
        orderId: "Order ID",
        serviceName: "Service Name",
        status: "Status",
        paymentStatus: "Payment",
        amount: "Amount",
        progress: "Progress",
        createdAt: "Created At",
        updatedAt: "Last Updated",
        action: "Action",
        viewDetail: "View Detail",
      },
    },
    detail: {
      eyebrow: "Order Detail",
      notFoundTitle: "Order not found",
      notFoundDescription:
        "No order information is currently available to display. Please return to the order list and continue viewing other orders.",
      backToOrders: "Back to Order List",
      progressTitle: "Progress",
      paymentTitle: "Payment Information",
      orderSummaryTitle: "Order Summary",
      timelineDescription:
        "The order will advance by stages and keep updating the current milestone.",
      repurchase: "Buy This Service Again",
      liveProgress: "View Real-Time Progress",
      goToTrack: "Go to Track Page",
    },
  },
  login: {
    eyebrow: "Account",
    title: "Login",
    description:
      "The login page is under development. Account login and order management will be supported later.",
  },
  notFound: {
    eyebrow: "Not Found",
    title: "Page not found",
    description:
      "The service you are trying to access does not exist, or the link has expired. You can return to the home page and continue browsing available services.",
    home: "Back to Home",
  },
};
