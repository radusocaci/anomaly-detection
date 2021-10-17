FROM python:3.7-slim
WORKDIR /assisted-living-flask-server
ADD . /assisted-living-flask-server
RUN pip install -r requirements.txt
CMD ["gunicorn", "app:app", "-w", "2", "--threads", "2"]