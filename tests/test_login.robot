*** Settings ***
Library    SeleniumLibrary
Library    OperatingSystem

*** Variables ***
${CHROME_DRIVER_PATH}    C:\chromedriver-win64\chromedriver.exe
${URL}                   http://localhost:8080
${DELAY}                 0.5 seconds
${SCREENSHOT_NAME}      ${CURDIR}${/}screenshot.png

*** Keywords ***
Show Screenshot
    Capture Page Screenshot    ${SCREENSHOT_NAME}
    Sleep    ${DELAY}
    Remove File    ${SCREENSHOT_NAME}

*** Test Cases ***
Test Login
    Open Browser    ${URL}/login    chrome
    Sleep    ${DELAY}
    Show Screenshot
    Input Text      id=username    yuri
    Sleep    ${DELAY}
    Show Screenshot
    Input Text      id=password    yuri
    Sleep    ${DELAY}
    Show Screenshot
    Click Button    id=login
    Sleep    ${DELAY}
    Show Screenshot
    Page Should Contain    Você está autenticado
    Close Browser