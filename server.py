#! /usr/bin/env python
import json

import flask
import flask_sqlalchemy
import sklearn.linear_model

app = flask.Flask(__name__)
app.config.from_pyfile('config.py')
db = flask_sqlalchemy.SQLAlchemy(app)


class Point(db.Model):
    __tablename__ = 'points'
    id = db.Column(db.Integer, primary_key=True)
    x = db.Column(db.Float, nullable=False)
    y = db.Column(db.Float, nullable=False)

    @property
    def serialize(self):
        return {'id': self.id, 'x': self.x, 'y': self.y}


@app.route('/')
def root():
    return flask.render_template('index.html')


@app.route('/data', methods=['GET'])
def get_all_data():
    points = Point.query.all()
    points_list = [point.serialize for point in points]
    return flask.jsonify(points_list)


@app.route('/data', methods=['POST'])
def add_data_point():
    data = flask.request.data.decode()
    data = json.loads(data)
    current_num_elements = db.session.query(Point).count()
    new_point = Point(id=current_num_elements,
                      x=data['x'], y=data['y'])
    db.session.add(new_point)
    db.session.commit()
    return get_all_data()


@app.route('/data', methods=['DELETE'])
def delete_all_data():
    Point.query.delete()
    db.session.commit()
    return get_all_data()


@app.route('/model', methods=['GET'])
def get_linreg_estimates():
    points = Point.query.all()
    x_tr = [[point.serialize['x']] for point in points]
    y_tr = [point.serialize['y'] for point in points]
    if len(x_tr) >= 2:
        model = sklearn.linear_model.LinearRegression()
        model.fit(x_tr, y_tr)
        estimates = {'intercept': model.intercept_,
                     'slope': model.coef_[0]}
        return flask.jsonify(estimates)
    else:
        return flask.jsonify({'intercept': 0, 'slope': 0})


if __name__ == '__main__':
    db.create_all()
    app.run()
