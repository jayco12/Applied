export function saveJobDetails(jobDetails) {
    chrome.storage.local.set({ jobDetails }, () => {
      console.log("Job details saved:", jobDetails);
    });
  }
  
  export function getJobDetails(callback) {
    chrome.storage.local.get("jobDetails", (result) => {
      callback(result.jobDetails || []);
    });
  }
  