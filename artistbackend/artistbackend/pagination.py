from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class MycustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    # max_page_size = 10
    page_query_param = "page"


    def get_offset(self, request):
        page_size = self.get_page_size(request)
        page_number = request.query_params.get(self.page_query_param, 1)
        
        try:
            page_number = int(page_number)
        except ValueError:
            page_number = 1
        return (page_number - 1) * page_size

    def get_paginated_data(self, data,offset ,total_count):
        """
        Create a paginated response with custom metadata
        """
        page_size = self.page_size
        total_pages = (total_count + page_size - 1) // page_size  # ceil(total_count / page_size)
        current_page = (offset // page_size) + 1

        return {
            "next": current_page + 1 if current_page < total_pages else None,
            "previous": current_page - 1 if current_page > 1 else None,
            "total_pages": total_pages,
            "count": total_count,
            "page_size": page_size,
            "results": data,
        }
