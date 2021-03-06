# -*- coding: utf-8 -*-

from django.test import TestCase
from django.core.urlresolvers import reverse

from spots.models import AccessPoint

class VoteViewTest(TestCase):

    def setUp(self):
        self.point = AccessPoint.objects.create(
            name='point 1',
            address='Rio de Janeiro, Brazil',
            lat=-22.9963233069,
            lng=-43.3637237549
        )
        self.url = reverse('spot_vote', kwargs={'id': self.point.id})

    def tearDown(self):
        self.point.delete()

    def test_view_exists(self):
        response = self.client.post(self.url, {'vote': 'up'})
        assert 200 == response.status_code

    def test_view_fails_on_get(self):
        response = self.client.get(self.url)
        assert 405 == response.status_code

    def test_view_fails_on_invalid_spot(self):
        url = reverse('spot_vote', kwargs={'id': 0})
        response = self.client.post(url, {'vote': 'up'})
        assert 404 == response.status_code

    def test_view_rejects_empty_parameter(self):
        response = self.client.post(self.url)
        assert 400 == response.status_code

    def test_view_rejects_bad_parameter(self):
        response = self.client.post(self.url, {'vote': 'x'})
        assert 400 == response.status_code

    def test_view_returns_json(self):
        response = self.client.post(self.url, {'vote': 'up'})
        assert response.content == '{"votes": 1, "score": 1}', 'Unexepected response: %s' % response.content

    def test_vote_up_counts_up(self):
        response = self.client.post(self.url, {'vote': 'up'})
        assert response.content == '{"votes": 1, "score": 1}', 'Unexepected response: %s' % response.content

    def test_vote_down_counts_down(self):
        response = self.client.post(self.url, {'vote': 'down'})
        assert response.content == '{"votes": 1, "score": -1}', 'Unexepected response: %s' % response.content

