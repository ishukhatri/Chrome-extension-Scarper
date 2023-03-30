const startParsing = (docSection) => {
  let jobLink = '';
  let jobTitle = '';
  let skills = '';
  let budget = '';
  let coverLetter = '';
  let clientBudget = '';
  let proposedTerms = '';

  const btnExpand = docSection[0].children[0].querySelector('button');
  if (btnExpand) {
    btnExpand.click();
  }

  try {
    jobLink = docSection[0].children[0].querySelector('a').href;
  } catch (error) {
    console.log(error);
  }

  try {
    jobTitle = docSection[0].children[0].querySelector('h3').innerText;
  } catch (err) {
    console.log(err);
  }

  try {
    const skillsListSelector = docSection[0].children[2].querySelectorAll('li');
    const skillsList = [];
    skillsListSelector.forEach((e) =>
      skillsList.push(e.innerText.replaceAll(' ', '-'))
    );
    skills = skillsList.join(' ');
  } catch (err) {
    console.log(err);
  }

  try {
    const hourlyRateSelector = docSection[0].children[4].querySelector(
      "div[data-test='terms-review-hourly']"
    );
    const fixedRateSelector = docSection[0].children[4].querySelector(
      "div[data-test='terms-review-fixed-price']"
    );

    if (hourlyRateSelector) {
      budget = hourlyRateSelector.firstChild.lastChild.innerText;
      proposedTerms = 'hourly';
    } else if (fixedRateSelector) {
      budget = fixedRateSelector.children[1].lastChild.innerText;
      proposedTerms = 'fixed';
    }
  } catch (err) {
    console.log(err);
  }

  try {
    coverLetter = docSection[2].querySelector('p').innerText;
  } catch (err) {
    console.log(err);
  }

  try {
    const clientBudgetSelector =
      docSection[0].children[4].children[0].querySelector('span');
    clientBudget = clientBudgetSelector.innerText.split(': ')[1];
  } catch (err) {
    console.log(err);
  }

  const payload = {
    jobLink,
    jobTitle,
    skills,
    budget,
    coverLetter,
    clientBudget,
    proposedTerms,
  };

  return payload;
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.status === 'start') {
    const docSection = document.getElementsByClassName('up-card-section');
    const payload = startParsing(docSection);

    const btnExpand = docSection[0].children[0].querySelector('button');
    if (btnExpand) {
      // wait for [0].children[0].querySelector('.up-truncation.is-expanded') to exist if btn exists
      const interval = setInterval(() => {
        const isExpanded = docSection[0].children[0].querySelector(
          '.up-truncation.is-expanded'
        );
        if (isExpanded) {
          try {
            payload.jobDescription =
              docSection[0].children[0].querySelector(
                '#up-truncation-1'
              ).innerText;
          } catch (err) {
            console.log(err);
          }

          sendResponse({ status: 'success', payload });
          clearInterval(interval);
        }
      }, 1000);
    } else {
      try {
        payload.jobDescription =
          docSection[0].children[0].querySelector('#up-truncation-1').innerText;
      } catch (err) {
        console.log(err);
      }

      sendResponse({ status: 'success', payload });
    }

    return true;
  }
});
