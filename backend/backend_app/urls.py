from django.urls import path
from .views import RetrieveImage, Home, ResultView

urlpatterns = [
    path('', Home.as_view(), name='home'),
    path('upload/', RetrieveImage.as_view(), name='upload_file'),
    path('result/', ResultView.as_view(), name='result_page'),
]
