FROM python:3.11.9-alpine3.19
WORKDIR /app
COPY ./requirements.txt /app
RUN apk add --no-cache --update \
    python3 python3-dev gcc \
    gfortran musl-dev \
    g++ jpeg-dev zlib-dev libjpeg \
    make cmake
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
ENV FLASK_APP=views/routes.py
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "5", "--access-logfile", "-", "wsgi:app"]
