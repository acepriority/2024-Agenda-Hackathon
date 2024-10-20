from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.views import View
from django.apps import apps
import requests
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


class Capitalization:
    def to_title_case(value):
        return ' '.join(word.capitalize() for word in value.split())


class Home(View):
    def get(self, request):
        return render(request, 'test.html', {})


@method_decorator(csrf_exempt, name='dispatch')
class RetrieveImage(View):
    def post(self, request):
        image = request.FILES.get('file')

        if image:
            process_result = ProcessImage.process(image)

            if 'error' in process_result:
                return JsonResponse(
                    {'error': process_result['error']},
                    status=500
                )

            result = process_result['result']
            predicted_class = result.get('predicted_class', 'Unknown')
            probability = result.get('probability', 0)

            capitalized_class = Capitalization.to_title_case(predicted_class)
            print(capitalized_class)

            return JsonResponse(
                {
                    'message': 'Image successfully processed.',
                    'predicted_class': capitalized_class,
                    'probability': probability,
                },
                status=200
            )

        return JsonResponse({'error': 'No image provided'}, status=400)


class ProcessImage:
    model_api_url = 'http://localhost:8080/predict'

    @classmethod
    def process(cls, image):
        try:
            files = {'file': (image.name, image.read())}
            response = requests.post(cls.model_api_url, files=files)

            print(f"Response content: {response.content}")

            if response.status_code == 200:
                try:
                    result = response.json()
                    print(f"Parsed JSON result: {result}")
                    return {'result': result}
                except ValueError:
                    return {'error': 'Invalid JSON response from the model API'}

            else:
                error_message = f"Error: {response.status_code} - {response.text}"
                return {'error': error_message}

        except Exception as e:
            return {'error': f"Error: {str(e)}"}


class RetrieveDiseaseandPestData:
    model = apps.get_model('backend_app', 'PestsAndDiseases')

    @classmethod
    def retrieve_data(cls, name):
        disease = get_object_or_404(cls.model, name=name)
        symptoms = disease.get_symptoms()
        treatment_guidelines = disease.get_treatment_guidelines()
        return {
            'disease': disease,
            'symptoms': symptoms,
            'treatment_guidelines': treatment_guidelines}


class ResultView(View):
    def get(self, request):
        predicted_class = request.GET.get('predicted_class', 'Unknown')
        probability = request.GET.get('probability', 0)

        query_model = RetrieveDiseaseandPestData.retrieve_data(predicted_class)

        return render(request, 'result.html', {
            'predicted_class': predicted_class,
            'probability': probability,
            'disease': query_model['disease'],
            'symptoms': [symptom.symptom for symptom in query_model['symptoms']],
            'treatment_guidelines': [guideline.guideline for guideline in query_model['treatment_guidelines']],
        })
