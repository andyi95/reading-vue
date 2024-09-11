FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONFAULTHANDLER=1 \
    POETRY_HOME="/opt/poetry"

ENV PATH="$POETRY_HOME/bin:$VENV_PATH/bin:$PATH"

WORKDIR /app

RUN apt update && apt install -y --no-install-recommends ffmpeg curl
RUN curl -sSL https://install.python-poetry.org | POETRY_HOME=$POETRY_HOME python -

COPY poetry.lock pyproject.toml ./

RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction

RUN poetry run python -m nltk.downloader universal_tagset  omw-1.4 stopwords wordnet averaged_perceptron_tagger

COPY . .

CMD ["poetry", "run", "python", "api.py"]
