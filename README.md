import requests
import json
import uuid
import time
import pytest
from pytest_steps import test_steps
from dotenv import load_dotenv
import os

load_dotenv()

BASE_URL = os.getenv("BASE_URL")
TOKEN = os.getenv("CLICKUP_API_TOKEN")
FOLDER_ID = os.getenv("CLICKUP_FOLDER_ID")
HEADERS = {
    "Authorization": TOKEN,
    "Content-Type": "application/json"
}

@pytest.fixture(scope="module")
def list_id():
    # Create a list and yield its ID for use in other tests
    list_id = create_list()
    yield list_id
    # Clean up by deleting the list after tests are done
    delete_list(list_id)

def create_list():
    # Генерація унікального імені для списку
    unique_name = f"Test {uuid.uuid4().hex[:6]}"
    url = f"{BASE_URL}/folder/{FOLDER_ID}/list"
    payload = {
        "name": unique_name,
        "content": "This is a test list",
        "due_date": None,
        "due_date_time": False,
        "priority": None,
    }

    response = requests.post(url, headers=HEADERS, data=json.dumps(payload))

    assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"

    # Збереження list_id для подальшого використання
    list_data = response.json()
    list_id = list_data.get("id")

    # Перевірка, що list_id був створений
    assert list_id is not None, "List ID was not created"

    # Додаткові перевірки (наприклад, що ім'я списку відповідає очікуваному)
    assert list_data.get("name") == unique_name, "List name does not match expected value"

    # Збереження list_id для подальших тестів
    return list_id

@test_steps("create", "get", "update", "delete")
def test_list_operations():
    # Step 1: Create List
    list_id = create_list()
    yield "create", list_id

    # Step 2: Get List
    url = f"{BASE_URL}/list/{list_id}"
    response = requests.get(url, headers=HEADERS)
    assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"
    list_data = response.json()
    assert list_data.get("id") == list_id, "Retrieved list ID does not match expected value"
    yield "get", list_id

    # Step 3: Update List
    updated_name = f"Updated {uuid.uuid4().hex[:6]}"
    url = f"{BASE_URL}/list/{list_id}"
    payload = {
        "name": updated_name,
        "content": "This is an updated test list",
        "due_date": None,
        "due_date_time": False,
        "priority": 2,
    }
    response = requests.put(url, headers=HEADERS, data=json.dumps(payload))
    assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"
    list_data = response.json()
    assert list_data.get("name") == updated_name, "List name was not updated correctly"
    yield "update", list_id

    # Step 4: Delete List
    delete_list(list_id)
    yield "delete", list_id

def delete_list(list_id):
    url = f"{BASE_URL}/list/{list_id}"
    response = requests.delete(url, headers=HEADERS)
    assert response.status_code == 200, f"Expected status code 200 but got {response.status_code}"

    # Зачекати кілька секунд перед повторним отриманням списку, щоб дати час серверу обробити видалення
    time.sleep(5)

    # Спроба отримати видалений список для перевірки, що його було видалено
    retry_count = 3
    for _ in range(retry_count):
        get_response = requests.get(url, headers=HEADERS)
        if get_response.status_code in [404, 400]:
            break
        time.sleep(2)
    else:
        assert False, "List was not deleted successfully"

# Add pytest_steps to the requirements.txt for installation
# requirements.txt
# pytest
# pytest-steps
# python-dotenv

# README.md

# Python ClickUp API Automation Tests

This project contains automated tests for ClickUp API's list operations using Python. The tests include creating, retrieving, updating, and deleting lists using the ClickUp API. These tests are implemented with the help of the `pytest` framework and `pytest-steps` for step-based testing.

## Project Setup

### Prerequisites

- Python 3.12 or higher
- pip (Python package installer)

### Installation

1. **Clone the Repository**
   ```sh
   git clone https://github.com/ypohranychnyy/r_d_python_clickup.git
   cd r_d_python_clickup
   ```

2. **Create and Activate a Virtual Environment**
   ```sh
   python -m venv venv
   source venv/bin/activate  # For macOS/Linux
   venv\Scripts\activate  # For Windows
   ```

3. **Install Dependencies**
   ```sh
   pip install -r requirements.txt
   ```

4. **Set Up Environment Variables**
   Create a `.env` file in the root directory of your project with the following variables:
   ```
   BASE_URL=https://api.clickup.com/api/v2
   CLICKUP_API_TOKEN=<your_clickup_api_token>
   CLICKUP_FOLDER_ID=<your_clickup_folder_id>
   ```

## Running Tests

To run the tests and generate an HTML report:

```sh
pytest tests/ --html=report.html --self-contained-html
```

- The HTML report will be saved in the `report.html` file for detailed analysis.

## Test Description

The following CRUD operations are tested:

1. **Create List**: A new list is created in the given folder.
2. **Get List**: The created list is retrieved to verify its presence.
3. **Update List**: The list name is updated to verify the update functionality.
4. **Delete List**: The list is deleted, and the deletion is verified.

## Continuous Integration Setup

The project is configured for CircleCI to automatically run tests whenever changes are pushed to the repository.

### CircleCI Configuration

The `.circleci/config.yml` file contains the configuration for running the tests in CircleCI. To set up CircleCI for this project:

1. Make sure to connect your GitHub repository with CircleCI.
2. The configuration installs dependencies, runs tests, and generates reports.

```yaml
version: 2.1

jobs:
  python-job:
    docker:
      - image: circleci/python:3.12
    steps:
      - checkout
      - run:
          name: set up venv
          command: |
            python -m venv venv
            . venv/bin/activate
      - run:
          name: install dependencies
          command: |
            . venv/bin/activate
            pip install -r requirements.txt
      - run:
          name: run tests
          command: |
            . venv/bin/activate
            pytest --html=./report/report.html --self-contained-html
      - store_artifacts:
          path: report/
          destination: python-report

workflows:
  build-and-test:
    jobs:
      - python-job
```

## Notes

- Ensure you have proper permissions and API tokens to access the ClickUp API.
- The tests include preconditions and postconditions to ensure that each test can be run independently.

## License

This project is licensed under the MIT License.

## Author

Yuriy Pohranychnyy
