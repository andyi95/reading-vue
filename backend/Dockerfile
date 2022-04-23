FROM python:3.9

ENV PYTHONUNBUFFERED=1 \
    POETRY_HOME="/opt/poetry"

ENV PATH="$POETRY_HOME/bin:$VENV_PATH/bin:$PATH"

WORKDIR /code

RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -

COPY poetry.lock pyproject.toml ./

RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction

RUN python -m nltk.downloader universal_tagset  omw-1.4 stopwords wordnet averaged_perceptron_tagger

CMD ["python", "api.py"]
